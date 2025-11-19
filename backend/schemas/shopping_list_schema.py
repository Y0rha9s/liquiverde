from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ShoppingItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class ShoppingItemCreate(ShoppingItemBase):
    pass

class ShoppingItemResponse(ShoppingItemBase):
    id: int
    subtotal: float
    
    class Config:
        from_attributes = True

class ShoppingListBase(BaseModel):
    name: str
    budget: float

class ShoppingListCreate(ShoppingListBase):
    pass

class ShoppingListResponse(ShoppingListBase):
    id: int
    created_at: datetime
    total_price: float
    total_savings: float
    sustainability_score: float
    items: List[ShoppingItemResponse] = []
    
    class Config:
        from_attributes = True