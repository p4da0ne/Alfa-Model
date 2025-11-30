import json
import pandas as pd
import numpy as np
import os
from app.ml.model_loader import model

# Используем порядок признаков из самой модели CatBoost
# Это гарантирует точное соответствие порядку, который использовался при обучении
if hasattr(model, 'feature_names_') and model.feature_names_:
    FEATURE_ORDER = list(model.feature_names_)
    print(f"Используется порядок признаков из модели: {len(FEATURE_ORDER)} признаков")
else:
    # Fallback: загружаем из схемы, если модель не содержит feature_names_
    SCHEMA_PATH = "/app/app/ml/artifacts/feature_schema.json"
    try:
        with open(SCHEMA_PATH) as f:
            schema = json.load(f)
            FEATURE_ORDER = schema.get("feature_order", [])
        print(f"Используется порядок признаков из feature_schema.json: {len(FEATURE_ORDER)} признаков")
    except Exception as e:
        print(f"Ошибка при загрузке feature_schema.json: {e}")
        raise ValueError("Не удалось определить порядок признаков")

# Загружаем категориальные признаки из схемы (они не хранятся в модели)
SCHEMA_PATH = "/app/app/ml/artifacts/feature_schema.json"
try:
    with open(SCHEMA_PATH) as f:
        schema = json.load(f)
        CAT_COLS = schema.get("categorical_features", [])
except Exception as e:
    print(f"Предупреждение: не удалось загрузить категориальные признаки: {e}")
    CAT_COLS = []

def prepare_features(raw: dict) -> pd.DataFrame:
    if not FEATURE_ORDER:
        raise ValueError("Модель не содержит информацию о порядке признаков")
    
    cleaned_data = []
    for col in FEATURE_ORDER:
        val = raw.get(col, None)

        if val is None or (isinstance(val, float) and np.isnan(val)) or (isinstance(val, str) and val.strip() == "") or (isinstance(val, str) and val.strip() == "None"):
            val = "missing"
        if isinstance(val, str):
            val = val.replace(",", ".")
            try:
                val = float(val)
            except ValueError:
                val = 0
        elif isinstance(val, (int, float)):
            val = float(val)
        else:
            val = 0
        cleaned_data.append(val)

    df = pd.DataFrame([cleaned_data], columns=FEATURE_ORDER)
    return df
