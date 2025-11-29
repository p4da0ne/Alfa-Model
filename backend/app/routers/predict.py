from fastapi import APIRouter
from app.models.request_models import PredictRequest
from app.models.response_models import PredictResponse
from app.ml.predict import predict_income
from app.services.db_service import get_features

router = APIRouter()

def calculate_income_raise(income: float, predict: float):
    diff = abs(predict - income)
    income_raise = (diff/income) if (predict > income) else -(diff/income)
    income_raise_percent = round(income_raise * 100, 1)
    return income_raise_percent

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
    prediction["income_raise_percents"] = calculate_income_raise(features["incomeValue"], prediction["prediction"])

    return prediction