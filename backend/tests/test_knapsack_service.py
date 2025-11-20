import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.knapsack_service import KnapsackService

def test_optimize_respects_budget_and_savings():
    ks = KnapsackService()
    products = [
        {"id": 1, "name": "Lechuga (x2)", "price": 1980, "sustainability_score": 80, "nutriscore": "A", "ecoscore": "A"},
        {"id": 2, "name": "Agua (x5)", "price": 4000, "sustainability_score": 60, "nutriscore": "A", "ecoscore": "C"},
        {"id": 3, "name": "Pollo (x1)", "price": 3500, "sustainability_score": 47.5, "nutriscore": "B", "ecoscore": "D"},
        {"id": 4, "name": "Queso (x1)", "price": 2800, "sustainability_score": 55, "nutriscore": "C", "ecoscore": "C"},
    ]
    budget = 6000
    result = ks.optimize_shopping_list(products=products, budget=budget)
    assert result["total_price"] <= budget
    assert result["savings"] == round(budget - result["total_price"], 2)
    assert result["total_products"] == len(result["selected_products"])

def test_optimize_zero_budget():
    ks = KnapsackService()
    products = [{"id": 1, "name": "Lechuga (x2)", "price": 1980, "sustainability_score": 80, "nutriscore": "A"}]
    budget = 0
    result = ks.optimize_shopping_list(products=products, budget=budget)
    assert result["total_price"] == 0
    assert result["total_products"] == 0
    assert result["savings"] == 0