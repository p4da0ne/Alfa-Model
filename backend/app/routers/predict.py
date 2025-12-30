from fastapi import APIRouter
from app.models.request_models import PredictRequest
from app.models.response_models import PredictResponse
from app.ml.predict import predict_income

router = APIRouter()

def calculate_income_raise(income: float, predict: float):
    diff = abs(predict - income)
    income_raise = (diff/income) if (predict > income) else -(diff/income)
    income_raise_percent = round(income_raise * 100, 1)
    return income_raise_percent

@router.post("/", response_model = PredictResponse)                             #Порядок признаков для загрузки в модель -> ml/artifacts/feature_schema.json
async def predict_with_explanation(payload: PredictRequest):
    if (payload.client_id):
        client_id = payload.client_id
    else:
        raise ValueError("client_id is required")

    prediction = predict_income(client_id)
    
    return prediction