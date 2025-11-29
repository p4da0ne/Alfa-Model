from pydantic import BaseModel, model_validator
from typing import Optional, Dict, Any

class PredictRequest(BaseModel):
    client_id: Optional[int] = None
    features: Optional[Dict[str, Any]] = None

    @model_validator(mode="before")
    def validate_input(cls, values):
        if not values.get("client_id") and not values.get("features"):
            raise ValueError("Provide either client_id or full features")
        return values