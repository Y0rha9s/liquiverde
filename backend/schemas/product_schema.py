from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    barcode: str
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    price: float
    store: Optional[str] = None
    nutriscore: Optional[str] = None
    ecoscore: Optional[str] = None
    sustainability_score: float = 0.0
    is_organic: bool = False
    image_url: Optional[str] = None
    description: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True