import pandas as pd
from model_loader import model, MODEL_VERSION
from feature_preprocessing import prepare_features

def predict_income(raw: dict):
    df = prepare_features(raw)
    prediction = model.predict(df)
    return {float(prediction), MODEL_VERSION}
