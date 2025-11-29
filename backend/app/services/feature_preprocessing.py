import json
import pandas as pd

with open("../ml/artifacts/feature_schema.json") as f:
    schema = json.load(f)

FEATURE_ORDER = schema["feature_order"]
CAT_COLS = schema["categorical_features"]

def prepare_features(raw: dict) -> pd.DataFrame:
    data = [raw.get(col, None) for col in FEATURE_ORDER]
    df = pd.DataFrame([data], columns=FEATURE_ORDER)
    return df
