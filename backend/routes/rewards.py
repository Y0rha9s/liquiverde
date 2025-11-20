from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.shopping_list import ShoppingList
from services.rewards_service import RewardsService

router = APIRouter(
    prefix="/rewards",
    tags=["rewards"]
)

rewards_service = RewardsService()

@router.get("/stats")
def get_rewards_stats(db: Session = Depends(get_db)):
    lists = db.query(ShoppingList).all()
    
    total_points = 0
    best_savings_percent = 0
    total_sustainability = 0
    count = 0
    
    for lst in lists:
        points = rewards_service.calculate_points(lst)
        total_points += points
        
        if lst.budget > 0:
            savings_percent = (lst.total_savings / lst.budget) * 100
            if savings_percent > best_savings_percent:
                best_savings_percent = savings_percent
        
        if lst.sustainability_score > 0:
            total_sustainability += lst.sustainability_score
            count += 1
    
    avg_sustainability = total_sustainability / count if count > 0 else 0
    
    badges = rewards_service.get_badges(total_points, best_savings_percent, avg_sustainability)
    
    return {
        "total_points": total_points,
        "badges": badges,
        "best_savings_percent": round(best_savings_percent, 2),
        "avg_sustainability_score": round(avg_sustainability, 2),
        "total_lists": len(lists)
    }