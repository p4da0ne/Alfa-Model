from fastapi import APIRouter
from app.models.request_models import PredictRequest
from app.models.response_models import RecommendationsResponse

router = APIRouter()

@router.post("/", response_model=RecommendationsResponse)
async def recommend():
    return