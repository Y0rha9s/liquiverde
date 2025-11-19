from sqlalchemy import Column, Integer, String, Float, Boolean
from database.connection import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    barcode = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String)
    category = Column(String)
    price = Column(Float, nullable=False)
    store = Column(String)

    # Datos nutricionales
    nutriscore = Column(String)
    ecoscore = Column(String)

    #Sostenibilidad
    sustainability_score = Column(Float, default=0.0)
    is_organic = Column(Boolean, default=False)

    #Adicionales
    image_url =  Column(String)
    description = Column(String)