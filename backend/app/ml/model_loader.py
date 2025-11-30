import joblib
import json
import pandas as pd
import shap
from catboost import CatBoostRegressor

with open("/app/app/ml/artifacts/metadata.json") as f:
    metadata = json.load(f)
    MODEL_VERSION = metadata["model_version"]

MODEL_PATH = "/app/app/ml/artifacts/catboost_income_110k.cbm"

def load_model():
    model = CatBoostRegressor()
    model.load_model(MODEL_PATH)
    return model

model = load_model()
explainer = shap.TreeExplainer(model)
