from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.connection import Base

class ShoppingItem(Base):
    __tablename__ = "shopping_items"
    
    id = Column(Integer, primary_key=True, index=True)
    shopping_list_id = Column(Integer, ForeignKey("shopping_lists.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    subtotal = Column(Float, default=0.0)
    
    shopping_list = relationship("ShoppingList", back_populates="items")
    product = relationship("Product")