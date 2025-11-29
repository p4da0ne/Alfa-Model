import pandas as pd
from model_loader import model, explainer, MODEL_VERSION
from app.ml.feature_preprocessing import prepare_features

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
