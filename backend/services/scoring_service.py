class ScoringService:
    
    def calculate_sustainability_score(
        self, price: float, 
        nutriscore: str = None, 
        ecoscore: str = None, 
        is_organic: bool = False, 
        category: str = "") -> float:
        
        nutri_score = self._nutriscore_to_points(nutriscore) * 0.4
        eco_score = self._ecoscore_to_points(ecoscore) * 0.3
        price_score = self._price_to_points(price) * 0.2
        organic_score = 10 if is_organic else 0
        total_score = nutri_score + eco_score + price_score + organic_score
        return round(total_score, 2)
    
    def _nutriscore_to_points(self, nutriscore: str) -> float:
        scores = {"A": 100, "B": 75, "C": 50, "D": 25, "E": 0}
        return scores.get(nutriscore, 50)
    
    def _ecoscore_to_points(self, ecoscore: str) -> float:
        scores = {"A": 100, "B": 75, "C": 50, "D": 25, "E": 0, "NOT-APPLICABLE": 50}
        return scores.get(ecoscore, 50)
    
    def _price_to_points(self, price: float) -> float:
        if price < 1000:
            return 100
        elif price < 3000:
            return 75
        elif price < 5000:
            return 50
        elif price < 10000:
            return 25
        else:
            return 0