from fastapi import APIRouter, HTTPException
from services.openfoodfacts_service import OpenFoodFactsService

router = APIRouter(
    prefix="/search",
    tags=["search"]
)

off_service = OpenFoodFactsService()

@router.get("/barcode/{barcode}")
async def search_by_barcode(barcode: str):
    """ buscar un productio en open food facts por codigo de barras """
    product = await off_service.get_product_by_barcode(barcode)

    if not product:
        raise HTTPException(status_code=404, detail="Producto no encotnrado en Open Food Facts")
    return product

@router.get("/products")
async def search_products(query: str, country: str = "chile"):
    """ Buscar productos por nombre """
    if not query or len(query) < 2:
        raise HTTPException(status_code=400, detail="La busqueda debe tener al menos 2 caracteres")

    products = await off_service.search_products(query, country)

    return {
        "query": query,
        "count": len(products),
        "products": products
    }