import joblib
import json
import pandas as pd
from catboost import CatBoostRegressor

with open("../ml/artifacts/metadata.json") as f:
    metadata = json.load(f)
    MODEL_VERSION = metadata["model_version"]

MODEL_PATH = "../ml/artifacts/model.cbm"

def load_model():
    model = CatBoostRegressor()
    model.load_model(MODEL_PATH)
    return model

model = load_model()

