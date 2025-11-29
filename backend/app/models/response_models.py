from pydantic import BaseModel
from typing import List, Dict

class PredictResponse(BaseModel):
    prediction: float
    model_version: str
    
class ExplainResponse(BaseModel):
    shap_values: Dict[str, float]

class RecommendationsResponse(BaseModel):
    offers: List[Dict[str, str]]