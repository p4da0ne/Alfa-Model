import numpy as np
from app.ml.model_loader import features_df, model, explainer, MODEL_VERSION
from app.ml.feature_preprocessing import create_feature_pipeline

def get_features(client_id:int):
    if features_df is None:
        raise RuntimeError("Features not loaded")
    if client_id not in features_df.index:
        return {}  # или raise 404
    row = features_df.loc[[client_id]]
    return row

def get_shap(client_id: int, top_n: int = 5):
    row_df = get_features(client_id)
    row_df_pipelined = create_feature_pipeline(row_df, inference=True)
    
    shap_values = explainer.shap_values(row_df_pipelined)
    shap_dict = dict(zip(row_df_pipelined.columns, shap_values[0]))
    
    # Топ положительных/отрицательных - преобразуем в список объектов
    sorted_features = sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True)[:top_n]
    top_features = [
        {
            "feature": feature_name,
            "value": round(float(shap_value), 4),
            "impact": "positive" if shap_value > 0 else "negative"
        }
        for feature_name, shap_value in sorted_features
    ]
    
    return top_features

def predict_income(client_id: int) -> dict:

    row_df = get_features(client_id)
    row_df_pipelined = create_feature_pipeline(row_df, inference=True)

    # Предсказание в лог-шкале
    pred_log = model.predict(row_df_pipelined)[0]  # [0] потому что одна строка
    
    # Обратное преобразование в рубли
    pred_rub = np.expm1(pred_log)  # exp(pred_log) - 1
    
    # Опционально: уверенность (из quantile или SHAP variance) — пока фиксированная
    confidence = 85.0  # 15% - по WMAE в конце обучения
    
    return {
        "client_id": client_id,
        "predicted_income_rub": round(float(pred_rub), 2),
        "shap_top_5": get_shap(client_id),
        "confidence": round(confidence, 1)
    }
