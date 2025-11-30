import json
import pandas as pd
import numpy as np

with open("/app/app/ml/artifacts/feature_schema.json") as f:
    schema = json.load(f)

FEATURE_ORDER = schema["feature_order"]
CAT_COLS = schema["categorical_features"]

def prepare_features(raw: dict) -> pd.DataFrame:
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
