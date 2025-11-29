from fastapi import APIRouter
from app.models.request_models import PredictRequest
from backend.app.ml.predict import predict_income
from app.models.response_models import PredictResponse
from app.services.db_service import get_features

router = APIRouter()

@router.post("/", response_model = PredictResponse)         #Порядок признаков для загрузки в модель -> ../ml/artifacts/feature_schema.json
async def predict(payload: PredictRequest):
    if payload.client_id:
        features = get_features(payload.client_id)
    else:
        features = payload.features.copy()

    if payload.features:
        features = {**features, **payload.features}

    prediction = predict_income(features)
    return prediction