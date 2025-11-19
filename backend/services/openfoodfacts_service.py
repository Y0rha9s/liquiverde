import httpx
from typing import Optional, Dict

class OpenFoodFactsService:
    BASE_URL = "https://world.openfoodfacts.org/api/v2"
    
    async def get_product_by_barcode(self, barcode: str) -> Optional[Dict]:
        """Buscar producto por código de barras"""
        url = f"{self.BASE_URL}/product/{barcode}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") == 1:
                        return self._parse_product(data.get("product", {}))
                return None
            except Exception as e:
                print(f"Error buscando producto: {e}")
                return None
    
    async def search_products(self, query: str, country: str = "chile") -> list:
        """Buscar productos por nombre"""
        url = f"{self.BASE_URL}/search"
        params = {
            "search_terms": query,
            "countries": country,
            "page_size": 10
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    products = data.get("products", [])
                    return [self._parse_product(p) for p in products]
                return []
            except Exception as e:
                print(f"Error en búsqueda: {e}")
                return []
    
    def _parse_product(self, product_data: Dict) -> Dict:
        """Parsear datos de Open Food Facts a nuestro formato"""
        return {
            "barcode": product_data.get("code", ""),
            "name": product_data.get("product_name", "Producto sin nombre"),
            "brand": product_data.get("brands", ""),
            "category": product_data.get("categories", ""),
            "nutriscore": product_data.get("nutriscore_grade", "").upper(),
            "ecoscore": product_data.get("ecoscore_grade", "").upper(),
            "image_url": product_data.get("image_url", ""),
            "is_organic": "organic" in product_data.get("labels_tags", [])
        }