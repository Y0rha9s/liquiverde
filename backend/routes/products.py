from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from models.product import Product
from schemas.product_schema import ProductCreate, ProductResponse
from services.scoring_service import ScoringService
from typing import List

router = APIRouter(
    prefix="/products",
    tags=["products"]
)

scoring_service = ScoringService()

@router.get("/", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(Product).filter(Product.barcode == product.barcode).first()
    if existing:
        raise HTTPException(status_code=400, detail="El producto con este código de barras ya existe")
    
    sustainability_score = scoring_service.calculate_sustainability_score(
        price=product.price,
        nutriscore=product.nutriscore,
        ecoscore=product.ecoscore,
        is_organic=product.is_organic,
        category=product.category or ""
    )
    
    product_dict = product.dict()
    product_dict["sustainability_score"] = sustainability_score
    
    new_product = Product(**product_dict)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product