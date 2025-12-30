import pandas as pd
import numpy as np

RAW_PATH = 'ml-resources/hackathon_income_test.csv'
PROCESSED_PATH = 'ml-resources/hackathon_income_test_processed.parquet'

KNOWN_CATEGORICAL = {
        'gender', 'adminarea', 'incomeValueCategory',
        'dp_ewb_last_organization', 'dp_ewb_last_employment_position',
        'addrref', 'city_smart_name', 'accountsalary_out_flag', 'blacklist_flag',
        'nonresident_flag', 'client_active_flag'
    }


def clean_financial_csv_safe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Опция для FutureWarning (рекомендую opt-in в новое поведение)
    pd.set_option('future.no_silent_downcasting', True)
    
    for col in df.columns:
        if col in KNOWN_CATEGORICAL:
            # Только для категориальных: чистим строки
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace(['nan', 'None', '', 'NaN', '<NA>'], np.nan)
            continue
        
        # Для потенциально числовых: работаем безопасно
        series = df[col]
        
        # Если уже numeric — пропускаем строковые операции
        if pd.api.types.is_numeric_dtype(series):
            # Только унифицируем NaN-like (на случай строковых 'nan')
            df[col] = series.replace(['', 'nan', '<NA>', 'None', 'null', 'NULL'], np.nan)
            continue
        
        # Если object — пытаемся очистить и конвертировать
        series_str = series.astype(str).str.strip()
        series_str = series_str.replace(['', 'nan', '<NA>', 'None', 'null', 'NULL'], np.nan)
        series_str = series_str.str.replace(',', '.', regex=False)

        converted = pd.to_numeric(series_str, errors='coerce')
        
        # Если >5% успешно конвертировалось — numeric
        if converted.notna().mean() >= 0.05:
            df[col] = converted
        else:
            # Иначе оставляем как категориальную строку
            df[col] = series_str.replace('nan', np.nan)
    
    # Явно category для категориальных (экономия памяти + CatBoost)
    cat_cols_present = [c for c in KNOWN_CATEGORICAL if c in df.columns]
    df[cat_cols_present] = df[cat_cols_present].astype('category')
    
    return df

# Основной pipeline
print("Чтение сырых данных...")
df = pd.read_csv(
    RAW_PATH,
    encoding='utf-8',
    dtype=str,
    sep=";"
)

print(f"Исходный shape: {df.shape}")

# 2. Очистка пропусков и чисел
print("Очистка пропусков и форматов, дроп ненужных столбцов...")
df = clean_financial_csv_safe(df)
print(f"После очистки: None count: {(df == None).sum().sum()}")
print(f"NaN count топ-10:\n{df.isna().sum().sort_values(ascending=False).head(10)}")

# 3. Дополнительно: явное указание категориальных (опционально, для экономии памяти)
for col in KNOWN_CATEGORICAL:
    if col in df.columns:
        df[col] = df[col].astype('category')
        
cat_cols_present = [c for c in KNOWN_CATEGORICAL if c in df.columns]

for col in cat_cols_present:
    # Заменяем NaN на строку "missing" (CatBoost поймёт как отдельную категорию)
    df[col] = df[col].cat.add_categories("missing").fillna("missing")
    # Или просто fillna строкой (если не category)
    # df[col] = df[col].fillna("missing")


# 4. Сохранение
print(f"Сохранение в {PROCESSED_PATH}...")
df.to_parquet(PROCESSED_PATH, index=False)

print("Готово!")
print(f"Финальный shape: {df.shape}")
print(f"Пропуски топ-10:\n{df.isnull().sum().sort_values(ascending=False).head(10)}")
print(f"Типы:\n{df.dtypes.value_counts()}")
print(df.head)