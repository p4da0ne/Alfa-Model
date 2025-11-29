from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import explain, predict, recommend

app = FastAPI(title="Income Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/predict", tags=["Predict"])
app.include_router(recommend.router, prefix="/recommend", tags=["Recommend"])

