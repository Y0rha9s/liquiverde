from database.connection import engine, Base
from models import Product, ShoppingList, ShoppingItem

def init_database():
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente!")

if __name__ == "__main__":
    init_database()