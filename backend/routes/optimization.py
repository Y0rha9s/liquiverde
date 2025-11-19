from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import get_db
from models.product import Product
from models.shopping_list import ShoppingList
from services.knapsack_service import KnapsackService
from pydantic import BaseModel
from typing import List, Optional, Dict

router = APIRouter(
    prefix="/optimization",
    tags=["optimization"]
)

knapsack_service = KnapsackService()

class OptimizationRequest(BaseModel):
    product_ids: List[int]
    budget: float
    weights: Optional[Dict[str, float]] = None

@router.post("/optimize")
def optimize_products(request: OptimizationRequest, db: Session = Depends(get_db)):
    """
    Optimiza una lista de productos usando el algoritmo de mochila multi-objetivo
    """
    
    # Obtener productos de la base de datos
    products = db.query(Product).filter(Product.id.in_(request.product_ids)).all()
    
    if not products:
        raise HTTPException(status_code=404, detail="No se encontraron productos")
    
    # Convertir a diccionarios
    products_dict = []
    for p in products:
        products_dict.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "sustainability_score": p.sustainability_score,
            "nutriscore": p.nutriscore,
            "ecoscore": p.ecoscore,
            "brand": p.brand,
            "store": p.store
        })
    
    # Aplicar algoritmo de optimización
    result = knapsack_service.optimize_shopping_list(
        products=products_dict,
        budget=request.budget,
        weights=request.weights
    )
    
    return result

@router.post("/optimize-list/{list_id}")
def optimize_shopping_list(list_id: int, db: Session = Depends(get_db)):
    """
    Optimiza una lista de compras existente
    """
    
    shopping_list = db.query(ShoppingList).filter(ShoppingList.id == list_id).first()
    
    if not shopping_list:
        raise HTTPException(status_code=404, detail="Lista no encontrada")
    
    # Obtener todos los productos de los items
    product_ids = [item.product_id for item in shopping_list.items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    
    if not products:
        raise HTTPException(status_code=404, detail="La lista no tiene productos")
    
    # Convertir a diccionarios
    products_dict = []
    for p in products:
        products_dict.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "sustainability_score": p.sustainability_score,
            "nutriscore": p.nutriscore,
            "ecoscore": p.ecoscore,
            "brand": p.brand,
            "store": p.store
        })
    
    # Optimizar con el presupuesto de la lista
    result = knapsack_service.optimize_shopping_list(
        products=products_dict,
        budget=shopping_list.budget
    )
    
    # Actualizar métricas de la lista
    shopping_list.total_savings = result["savings"]
    shopping_list.sustainability_score = result["avg_sustainability_score"]
    
    db.commit()
    
    return {
        "list_id": list_id,
        "list_name": shopping_list.name,
        **result
    }