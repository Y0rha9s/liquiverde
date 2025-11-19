from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from models.shopping_list import ShoppingList
from models.shopping_item import ShoppingItem
from models.product import Product
from schemas.shopping_list_schema import ShoppingListCreate, ShoppingListResponse, ShoppingItemCreate
from typing import List

router = APIRouter(
    prefix="/shopping-lists",
    tags=["shopping-lists"]
)

@router.get("/", response_model=List[ShoppingListResponse])
def get_shopping_lists(db: Session = Depends(get_db)):
    lists = db.query(ShoppingList).all()
    return lists

@router.get("/{list_id}", response_model=ShoppingListResponse)
def get_shopping_list(list_id: int, db: Session = Depends(get_db)):
    shopping_list = db.query(ShoppingList).filter(ShoppingList.id == list_id).first()
    if not shopping_list:
        raise HTTPException(status_code=404, detail="Lista no encontrada")
    return shopping_list

@router.post("/", response_model=ShoppingListResponse, status_code=201)
def create_shopping_list(shopping_list: ShoppingListCreate, db: Session = Depends(get_db)):
    new_list = ShoppingList(**shopping_list.dict())
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list

@router.post("/{list_id}/items", response_model=ShoppingListResponse)
def add_item_to_list(list_id: int, item: ShoppingItemCreate, db: Session = Depends(get_db)):
    shopping_list = db.query(ShoppingList).filter(ShoppingList.id == list_id).first()
    if not shopping_list:
        raise HTTPException(status_code=404, detail="Lista no encontrada")
    
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    item_subtotal = product.price * item.quantity
    
    new_item = ShoppingItem(
        shopping_list_id=list_id,
        product_id=item.product_id,
        quantity=item.quantity,
        subtotal=item_subtotal
    )
    
    db.add(new_item)
    shopping_list.total_price += item_subtotal
    
    db.commit()
    db.refresh(shopping_list)
    return shopping_list