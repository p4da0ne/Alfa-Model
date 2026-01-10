from catboost import CatBoostRegressor, Pool
import catboost
import pandas as pd
import numpy as np
from feature_preprocessing import create_feature_pipeline
from sklearn.model_selection import train_test_split
# Загружаем данные (твой processed parquet)
df = pd.read_parquet('ml-resources/hackathon_income_train_processed.parquet')

df_features = create_feature_pipeline(df)
# Создаём бины дохода (например, 10 децилей — robust к skew)
df_features['income_bin'] = pd.qcut(df_features['target'], q=10, duplicates='drop')

# Stratified split (80/20)
train_df, val_df = train_test_split(
    df_features,
    test_size=0.2,
    random_state=42,          # воспроизводимость
    stratify=df_features['income_bin'] # ← ключ: сохраняем распределение дохода
)

train_df = train_df.drop('income_bin', axis=1)
val_df = val_df.drop('income_bin', axis=1)

print("Train shape:", train_df.shape)
print("Val shape:", val_df.shape)

X_train = train_df.drop(columns=['target', 'w'], axis=1)
y_train = np.log1p(train_df['target'])
w_train = train_df['w']  # веса!

X_val = val_df.drop(columns=['target', 'w'], axis=1)
y_val = np.log1p(val_df['target'])
w_val = val_df['w']

# Определяем категориальные признаки
CAT_COLS = ['gender', 'adminarea', 'incomeValueCategory',
        'dp_ewb_last_organization', 'dp_ewb_last_employment_position',
        'addrref', 'city_smart_name', 'accountsalary_out_flag', 'blacklist_flag',
        'nonresident_flag', 'client_active_flag']

cat_features = [X_train.columns.get_loc(c) for c in CAT_COLS if c in X_train.columns]

# Создаём Pool с весами
train_pool = Pool(
    data=X_train,
    label=y_train,
    cat_features=cat_features,
)

val_pool = Pool(
    data=X_val,
    label=y_val,
    cat_features=cat_features,
)

# Модель
model = CatBoostRegressor(
    iterations=2000,
    depth=8,
    learning_rate=0.05,
    loss_function='MAE',      # базовая MAE, но взвешенная за счёт weights
    eval_metric='MAE',        # на валидации будет WMAE (учтёт w_val)
    random_seed=42,
    verbose=100,
    task_type="GPU",
)

# Обучение
model.fit(
    train_pool,
    eval_set=val_pool,
    early_stopping_rounds=100,
    use_best_model=True,
)

model.save_model("backend/app/ml/artifacts/catboost_income_biba.cbm")  # или .bin

# # Дополнительно: сохрани метаданные (версия, дата, метрики)
# import json
# from datetime import datetime

# metadata = {
#     "model_version": "1.1.0",  # инкрементируй при новых обучениях
#     "training_date": datetime.now().isoformat(),
#     "catboost_version": catboost.__version__,
#     "wmae_cv": 12345.67,  # твоя метрика на CV
#     "feature_count": model.feature_count_,
#     "description": "Final model after feature selection and tuning"
# }

# with open("ml-resources/artifacts/metadata.json", "w") as f:
#     json.dump(metadata, f, indent=4, ensure_ascii=False)

# Предсказание (на валидации)
pred_val = model.predict(X_val)

# Ручная проверка WMAE (должна совпадать с последней строкой лога CatBoost)
def wmae(y_true, y_pred, weights):
    return np.sum(weights * np.abs(y_true - y_pred)) / np.sum(weights)

print(model.feature_names_)

print("Ручной WMAE:", wmae(y_val, pred_val, w_val))