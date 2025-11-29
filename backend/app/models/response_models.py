from pydantic import BaseModel
from typing import List, Dict

class PredictResponse(BaseModel):
    prediction: float
    model_version: str
    shap_values: dict
    shap_top: dict

class ExplainResponse(BaseModel):
    shap_values: Dict[str, float]

class RecommendationsResponse(BaseModel):
    offers: List[Dict[str, str]]