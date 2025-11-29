from fastapi import APIRouter
from app.models.request_models import PredictRequest
from app.models.response_models import PredictResponse
from app.ml.predict import predict_income
from app.services.db_service import get_features

router = APIRouter()

@router.post("/", response_model = PredictResponse)                             #Порядок признаков для загрузки в модель -> ../ml/artifacts/feature_schema.json
async def predict_with_explanation(payload: PredictRequest, top_n: int = 5):
    if payload.client_id:
        db_features = get_features(payload.client_id)
    else:
        db_features = {}

    features = db_features.copy()

    if payload.features:
        features.update(payload.features)

    prediction = predict_income(features)

    return prediction