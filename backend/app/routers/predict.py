from fastapi import APIRouter
from app.services.model_loader import predict_income
from app.models.response_models import PredictResponse

router = APIRouter()

@router.post("/", response_model = PredictResponse)
def predict(client: dict):
    prediction = predict_income(client)
    return prediction