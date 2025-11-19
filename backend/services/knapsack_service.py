from typing import List, Dict

class KnapsackService:
    
    def optimize_shopping_list(self, products: List[Dict], budget: float, weights: Dict[str, float] = None) -> Dict:
        if weights is None:
            weights = {"price": 0.3, "sustainability": 0.4, "nutrition": 0.3}
        
        scored_products = []
        for product in products:
            combined_score = self._calculate_combined_score(product, weights)
            scored_products.append({
                **product,
                "combined_score": combined_score,
                "value_ratio": combined_score / product["price"] if product["price"] > 0 else 0
            })
        
        scored_products.sort(key=lambda x: x["value_ratio"], reverse=True)
        
        selected = []
        total_price = 0
        total_sustainability = 0
        total_nutrition = 0
        
        for product in scored_products:
            if total_price + product["price"] <= budget:
                selected.append(product)
                total_price += product["price"]
                total_sustainability += product.get("sustainability_score", 0)
                total_nutrition += self._nutriscore_to_numeric(product.get("nutriscore", "C"))
        
        avg_sustainability = total_sustainability / len(selected) if selected else 0
        avg_nutrition = total_nutrition / len(selected) if selected else 0
        savings = budget - total_price
        
        return {
            "selected_products": selected,
            "total_products": len(selected),
            "total_price": round(total_price, 2),
            "budget": budget,
            "savings": round(savings, 2),
            "savings_percentage": round((savings / budget * 100), 2) if budget > 0 else 0,
            "avg_sustainability_score": round(avg_sustainability, 2),
            "avg_nutrition_score": round(avg_nutrition, 2),
            "optimization_score": round(self._calculate_optimization_score(total_price, budget, avg_sustainability, avg_nutrition), 2)
        }
    
    def _calculate_combined_score(self, product: Dict, weights: Dict) -> float:
        max_price = 10000
        price_score = (1 - (product["price"] / max_price)) * 100 if product["price"] < max_price else 0
        sustainability_score = product.get("sustainability_score", 50)
        nutrition_score = self._nutriscore_to_numeric(product.get("nutriscore", "C"))
        combined = (price_score * weights["price"] + sustainability_score * weights["sustainability"] + nutrition_score * weights["nutrition"])
        return combined
    
    def _nutriscore_to_numeric(self, nutriscore: str) -> float:
        scores = {"A": 100, "B": 75, "C": 50, "D": 25, "E": 0}
        return scores.get(nutriscore, 50)
    
    def _calculate_optimization_score(self, total_price: float, budget: float, avg_sustainability: float, avg_nutrition: float) -> float:
        budget_usage = total_price / budget if budget > 0 else 0
        if 0.85 <= budget_usage <= 0.95:
            budget_score = 100
        elif budget_usage < 0.85:
            budget_score = budget_usage / 0.85 * 100
        else:
            budget_score = (1 - (budget_usage - 0.95) / 0.05) * 100
        optimization = budget_score * 0.3 + avg_sustainability * 0.4 + avg_nutrition * 0.3
        return max(0, min(100, optimization))