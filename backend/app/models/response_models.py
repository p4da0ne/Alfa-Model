from pydantic import BaseModel
from typing import List, Dict

class PredictResponse(BaseModel):
    client_id: int
    predicted_income_rub: float
    predicted_income_log: float
    shap_top_5: dict
    confidence: float


class RecommendationsResponse(BaseModel):
    offers: List[Dict[str, str]]