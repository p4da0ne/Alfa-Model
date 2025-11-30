import pandas as pd
import numpy as np
from app.ml.model_loader import model, explainer, MODEL_VERSION
from app.ml.feature_preprocessing import prepare_features, FEATURE_ORDER, CAT_COLS

def predict_income(raw: dict, top_n: int = 5):
    df = prepare_features(raw)
    
    # prepare_features уже создает DataFrame с правильным порядком колонок (из model.feature_names_)
    # Но для безопасности убеждаемся, что порядок колонок соответствует порядку признаков модели
    if hasattr(model, 'feature_names_') and model.feature_names_:
        # Переупорядочиваем колонки в соответствии с порядком признаков модели
        # Это гарантирует, что даже если порядок изменился, все будет работать
        df = df[model.feature_names_]
    
    # Используем RawFormulaVal для регрессии (предсказание значения)
    # model.predict() возвращает массив, берем первый элемент
    prediction_array = model.predict(df, prediction_type="RawFormulaVal")
    prediction = float(prediction_array[0]) if len(prediction_array) > 0 else 0.0
    
    # Для confidence используем стандартное отклонение или фиксированное значение
    # Если модель не возвращает confidence напрямую, используем приблизительное значение
    confidence = 95.0  # Можно заменить на реальное вычисление confidence

    shap_values = explainer(df)
    shap_dict = dict(zip(df.columns, shap_values.values[0]))
    
    # Конвертируем numpy типы в обычные Python типы для сериализации
    shap_dict_clean = {k: float(v) if isinstance(v, (np.integer, np.floating)) else v for k, v in shap_dict.items()}
    top_features = dict(sorted(shap_dict_clean.items(), key=lambda x: abs(x[1]), reverse=True)[:top_n])
    # Конвертируем значения в top_features тоже
    top_features_clean = {k: float(v) if isinstance(v, (np.integer, np.floating)) else v for k, v in top_features.items()}

    return {"prediction": prediction, 
            "confidence": float(confidence),
            "model_version": MODEL_VERSION, 
            "shap_values": shap_dict_clean,  # Используем shap_values вместо shap
            "shap_top": top_features_clean}


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
