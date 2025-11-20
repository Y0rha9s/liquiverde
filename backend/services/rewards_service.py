class RewardsService:
    
    def calculate_points(self, shopping_list):
        points = 0
        
        # Puntos por ahorro (1 punto por cada % de ahorro)
        if shopping_list.budget > 0:
            savings_percent = (shopping_list.total_savings / shopping_list.budget) * 100
            points += int(savings_percent)
        
        # Puntos por sostenibilidad (score promedio / 10)
        if shopping_list.sustainability_score > 0:
            points += int(shopping_list.sustainability_score / 10)
        
        # Bonus: 20 puntos si ahorro > 30%
        if savings_percent > 30:
            points += 20
        
        return points
    
    def get_badges(self, total_points, best_savings_percent, avg_sustainability):
        badges = []
        
        # Badge por puntos totales
        if total_points >= 100:
            badges.append({
                "name": "Experto en Ahorros",
                "icon": "💰",
                "description": "Has acumulado más de 100 puntos"
            })
        
        # Badge por mejor ahorro
        if best_savings_percent >= 30:
            badges.append({
                "name": "Ahorrador Maestro",
                "icon": "🎯",
                "description": "Lograste ahorrar más del 30% en una compra"
            })
        
        # Badge por sostenibilidad
        if avg_sustainability >= 70:
            badges.append({
                "name": "Eco-Warrior",
                "icon": "🌱",
                "description": "Mantienes un score de sostenibilidad alto"
            })
        
        if total_points >= 50:
            badges.append({
                "name": "Comprador Inteligente",
                "icon": "🧠",
                "description": "Has optimizado múltiples compras"
            })
        
        return badges