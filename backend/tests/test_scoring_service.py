import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.scoring_service import ScoringService

def test_score_a_b_organic():
    s = ScoringService()
    score = s.calculate_sustainability_score(price=1200, nutriscore="A", ecoscore="B", is_organic=True, category="Lácteos")
    assert score == 87.5

def test_score_c_d_non_organic_high_price():
    s = ScoringService()
    score = s.calculate_sustainability_score(price=12000, nutriscore="C", ecoscore="D", is_organic=False, category="Carnes")
    assert score == 27.5

def test_score_a_a_non_organic_mid_price():
    s = ScoringService()
    score = s.calculate_sustainability_score(price=2800, nutriscore="A", ecoscore="A", is_organic=False, category="Lácteos")
    assert score == 85.0