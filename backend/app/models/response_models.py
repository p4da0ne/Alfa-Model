from pydantic import BaseModel
from typing import List, Dict

class ShapFeature(BaseModel):
    feature: str
    value: float
    impact: str  # "positive" or "negative"

class PredictResponse(BaseModel):
    client_id: int
    predicted_income_rub: float
    shap_top_5: List[ShapFeature]
    confidence: float


class RecommendationsResponse(BaseModel):
    offers: List[Dict[str, str]]