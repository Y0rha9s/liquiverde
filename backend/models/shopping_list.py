from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.connection import Base

class ShoppingList(Base):
    __tablename__ = "shopping_lists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    budget = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    total_price = Column(Float, default=0.0)
    total_savings = Column(Float, default=0.0)
    sustainability_score = Column(Float, default=0.0)
    
    items = relationship("ShoppingItem", back_populates="shopping_list", cascade="all, delete-orphan")