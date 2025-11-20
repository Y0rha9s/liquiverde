import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

def test_search_routes_exist():
    from routes.search import router
    route_paths = [route.path for route in router.routes]
    assert "/search/barcode/{barcode}" in route_paths
    assert "/search/products" in route_paths

def test_optimization_routes_exist():
    from routes.optimization import router
    route_paths = [route.path for route in router.routes]
    assert "/optimization/optimize" in route_paths
    assert "/optimization/optimize-list/{list_id}" in route_paths