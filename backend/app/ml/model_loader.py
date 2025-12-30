import joblib
import json
import pandas as pd
import shap
from catboost import CatBoostRegressor

with open("app/ml/artifacts/metadata.json") as f:
    metadata = json.load(f)
    MODEL_VERSION = metadata["model_version"]

MODEL_PATH = "app/ml/artifacts/catboost_income_biba.cbm"
PARQUET_PATH = "app/ml/ml-resources/hackathon_income_test_processed.parquet"

model = CatBoostRegressor()
model.load_model(MODEL_PATH)

features_df = pd.read_parquet(PARQUET_PATH)
features_df.index = features_df.index.astype(int)  # на всякий id как int
print(f"Parquet загружен глобально: {features_df.shape}")

explainer = shap.TreeExplainer(model)
