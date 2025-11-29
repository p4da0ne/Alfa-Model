import joblib
import json
import pandas as pd
from catboost import CatBoostRegressor
from feature_preprocessing import prepare_features

with open("../ml/artifacts/metadata.json") as f:
    metadata = json.load(f)
    MODEL_VERSION = metadata["model_version"]

model = CatBoostRegressor()
model.load_model("../ml/artifacts/model.cbm")

def predict_income(raw: dict):
    df = prepare_features(raw)
    prediction = model.predict(df)
    return {float(prediction), MODEL_VERSION}