from pydantic import BaseModel
from typing import List, Dict

class PredictResponse(BaseModel):
    prediction: float
    confidence: float
    model_version: str
    shap_values: dict
    shap_top: dict
    income_raise: int


class RecommendationsResponse(BaseModel):
    offers: List[Dict[str, str]]