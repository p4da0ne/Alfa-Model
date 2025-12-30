import catboost
import pandas as pd
import numpy as np
from feature_preprocessing import create_feature_pipeline_inference
from model_loader import load_model

df = pd.read_parquet('ml-resources/hackathon_income_test_processed.parquet')
df_features = create_feature_pipeline_inference(df)

model = load_model()

predictions = model.predict(df_features)

df['prediction'] = predictions
df[['id', 'prediction']].to_csv('submission.csv', index=False)