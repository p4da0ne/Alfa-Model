import pandas as pd
import numpy as np
from model_loader import model, explainer, MODEL_VERSION
from app.ml.feature_preprocessing import prepare_features, FEATURE_ORDER, CAT_COLS

def predict_income(raw: dict, top_n: int = 5):
    df = prepare_features(raw)
    prediction = model.predict(df)

    shap_values = explainer(df)
    shap_dict = dict(zip(df.columns, shap_values.values[0]))
    top_features = dict(sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True)[:top_n])

    return {"prediction": float(prediction), 
            "model_version": MODEL_VERSION, 
            "shap": shap_dict, 
            "shap_top": top_features}


def compute_proxy_metrics(features_dict, prediction):
    metrics = {}

    # 1. Проверка распределения предсказаний
    metrics["predicted_income"] = float(prediction)
    metrics["is_negative"] = prediction < 0
    metrics["is_zero"] = prediction == 0

    # 2. Доля пустых признаков
    total_features = len(FEATURE_ORDER)
    missing_count = sum(
        1 for f in FEATURE_ORDER if features_dict.get(f) is None
        or (isinstance(features_dict.get(f), str) and features_dict.get(f).strip() == "")
        or (isinstance(features_dict.get(f), float) and np.isnan(features_dict.get(f)))
    )
    metrics["missing_feature_ratio"] = missing_count / total_features
    

    return metrics
