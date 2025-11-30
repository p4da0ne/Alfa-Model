from pydantic import BaseModel, model_validator
from typing import Optional, Dict, Any

class PredictRequest(BaseModel):
    client_id: Optional[int] = None
    features: Optional[Dict[str, Any]] = None

    @model_validator(mode="after")
    def validate_input(self):
        # Проверяем, что хотя бы одно поле заполнено
        # client_id может быть 0, поэтому проверяем только на None
        has_client_id = self.client_id is not None
        has_features = self.features is not None and len(self.features) > 0
        
        if not has_client_id and not has_features:
            raise ValueError("Provide either client_id or full features")
        return self