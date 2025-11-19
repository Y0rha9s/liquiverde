from sqlalchemy.orm import Session
from database.connection import SessionLocal
from models.product import Product
from services.scoring_service import ScoringService

scoring_service = ScoringService()

PRODUCTOS_SEED = [
    # Lácteos (3)
    {"barcode": "7804400000043", "name": "Leche Entera Soprole 1L", "brand": "Soprole", "category": "Lácteos", "price": 1050, "store": "Líder", "nutriscore": "B", "ecoscore": "C", "is_organic": False},
    {"barcode": "7804400000050", "name": "Queso Gauda Colun 250g", "brand": "Colun", "category": "Lácteos", "price": 2800, "store": "Jumbo", "nutriscore": "C", "ecoscore": "C", "is_organic": False},
    {"barcode": "7804400000067", "name": "Yogurt Griego Natural 150g", "brand": "Nestlé", "category": "Lácteos", "price": 650, "store": "Santa Isabel", "nutriscore": "A", "ecoscore": "B", "is_organic": False},
    
    # Frutas y Verduras (3)
    {"barcode": "7802900000025", "name": "Manzanas Royal Gala 1kg", "brand": "Hortifrut", "category": "Frutas", "price": 1200, "store": "Líder", "nutriscore": "A", "ecoscore": "A", "is_organic": True},
    {"barcode": "7802900000032", "name": "Tomates Cherry 500g", "brand": "Del Huerto", "category": "Verduras", "price": 1800, "store": "Jumbo", "nutriscore": "A", "ecoscore": "B", "is_organic": True},
    {"barcode": "7802900000049", "name": "Lechuga Hidropónica", "brand": "Verde Vivo", "category": "Verduras", "price": 990, "store": "Líder", "nutriscore": "A", "ecoscore": "A", "is_organic": True},
    
    # Carnes (2)
    {"barcode": "7805000000017", "name": "Pechuga Pollo 1kg", "brand": "Agrosuper", "category": "Carnes", "price": 3500, "store": "Jumbo", "nutriscore": "B", "ecoscore": "D", "is_organic": False},
    {"barcode": "7805000000024", "name": "Carne Molida 500g", "brand": "PF", "category": "Carnes", "price": 4200, "store": "Santa Isabel", "nutriscore": "C", "ecoscore": "E", "is_organic": False},
    
    # Panadería (2)
    {"barcode": "7806000000011", "name": "Pan Integral 500g", "brand": "Ideal", "category": "Panadería", "price": 1600, "store": "Líder", "nutriscore": "A", "ecoscore": "B", "is_organic": True},
    {"barcode": "7806000000028", "name": "Pan Marraqueta 4 unidades", "brand": "Castaño", "category": "Panadería", "price": 800, "store": "Jumbo", "nutriscore": "C", "ecoscore": "C", "is_organic": False},
    
    # Bebidas (3)
    {"barcode": "7807000000015", "name": "Agua Mineral Cachantun 1.5L", "brand": "Cachantun", "category": "Bebidas", "price": 800, "store": "Líder", "nutriscore": "A", "ecoscore": "C", "is_organic": False},
    {"barcode": "7807000000022", "name": "Jugo Manzana 1L", "brand": "Watts", "category": "Bebidas", "price": 1900, "store": "Santa Isabel", "nutriscore": "B", "ecoscore": "C", "is_organic": False},
    {"barcode": "7807000000039", "name": "Té Verde 20 bolsas", "brand": "Supremo", "category": "Bebidas", "price": 2500, "store": "Jumbo", "nutriscore": "A", "ecoscore": "A", "is_organic": True},
    
    # Snacks (2)
    {"barcode": "7808000000019", "name": "Frutos Secos Mix 200g", "brand": "Nuts", "category": "Snacks", "price": 3200, "store": "Líder", "nutriscore": "B", "ecoscore": "B", "is_organic": True},
    {"barcode": "7808000000026", "name": "Barras Cereal 6 unidades", "brand": "Quaker", "category": "Snacks", "price": 2100, "store": "Jumbo", "nutriscore": "B", "ecoscore": "C", "is_organic": False},
    
    # Cereales y Granos (3)
    {"barcode": "7809000000013", "name": "Arroz Integral 1kg", "brand": "Tucapel", "category": "Granos", "price": 1500, "store": "Santa Isabel", "nutriscore": "A", "ecoscore": "B", "is_organic": True},
    {"barcode": "7809000000020", "name": "Avena Instantánea 500g", "brand": "Quaker", "category": "Cereales", "price": 1800, "store": "Líder", "nutriscore": "A", "ecoscore": "B", "is_organic": False},
    {"barcode": "7809000000037", "name": "Quinoa 500g", "brand": "Andina", "category": "Granos", "price": 4500, "store": "Jumbo", "nutriscore": "A", "ecoscore": "A", "is_organic": True},
    
    # Enlatados (2)
    {"barcode": "7810000000010", "name": "Atún en Agua 170g", "brand": "San José", "category": "Enlatados", "price": 1200, "store": "Líder", "nutriscore": "B", "ecoscore": "D", "is_organic": False},
    {"barcode": "7810000000027", "name": "Porotos Negros 400g", "brand": "Acuenta", "category": "Enlatados", "price": 900, "store": "Santa Isabel", "nutriscore": "A", "ecoscore": "B", "is_organic": False}
]

def seed_database():
    db = SessionLocal()
    
    try:
        # Verificar si ya hay productos
        existing_count = db.query(Product).count()
        if existing_count >= 20:
            print(f"Ya existen {existing_count} productos en la base de datos.")
            print(" No se insertaron datos para evitar duplicados.")
            return
        
        print("Iniciando seed de datos...")
        productos_creados = 0
        
        for producto_data in PRODUCTOS_SEED:
            # Verificar si el producto ya existe por barcode
            existing = db.query(Product).filter(Product.barcode == producto_data["barcode"]).first()
            
            if not existing:
                # Calcular sustainability_score
                sustainability_score = scoring_service.calculate_sustainability_score(
                    price=producto_data["price"],
                    nutriscore=producto_data["nutriscore"],
                    ecoscore=producto_data["ecoscore"],
                    is_organic=producto_data["is_organic"],
                    category=producto_data["category"]
                )
                
                # Crear producto
                producto = Product(
                    barcode=producto_data["barcode"],
                    name=producto_data["name"],
                    brand=producto_data["brand"],
                    category=producto_data["category"],
                    price=producto_data["price"],
                    store=producto_data["store"],
                    nutriscore=producto_data["nutriscore"],
                    ecoscore=producto_data["ecoscore"],
                    is_organic=producto_data["is_organic"],
                    sustainability_score=sustainability_score
                )
                
                db.add(producto)
                productos_creados += 1
                print(f"Creado: {producto_data['name']} - Score: {sustainability_score}")
        
        db.commit()
        print(f"\nSeed completado! {productos_creados} productos creados.")
        print(f"Total en DB: {db.query(Product).count()} productos")
        
    except Exception as e:
        print(f"Error en seed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()