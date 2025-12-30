import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import mannwhitneyu

df = pd.read_parquet('ml-resources/hackathon_income_train_processed.parquet')

# Выбираем колонки с >5% missing (кандидаты)
missing_rates = df.isnull().mean()
candidate_cols = missing_rates[(missing_rates > 0.05) & (missing_rates < 0.95)].index

missing_indicators = pd.DataFrame({
    f"{col}_is_missing": df[col].isnull().astype(int)
    for col in candidate_cols
})

df = pd.concat([df, missing_indicators], axis=1)

print("Создано индикаторов:", len(candidate_cols))

meaningful_candidates = []

for col in candidate_cols:
    observed = df.loc[df[col].notna(), 'target']
    missing = df.loc[df[col].isnull(), 'target']
    
    if len(observed) < 10 or len(missing) < 10:
        continue
    
    if not pd.api.types.is_numeric_dtype(observed):
        continue
    
    median_observed = observed.median()
    median_missing = missing.median()
    ratio = median_missing / median_observed if median_observed > 0 else np.nan
    ratio_str = f"{ratio:.2f}" if not np.isnan(ratio) else "N/A"
    
    stat, p = mannwhitneyu(observed, missing, alternative='two-sided')
    
    print(f"{col}:")
    print(f"  Median observed: {median_observed:.0f}, missing: {median_missing:.0f} (ratio {ratio_str})")
    print(f"  Mann-Whitney p-value: {p:.2e}")
    
    if p < 0.01 and (not np.isnan(ratio)) and abs(ratio - 1) > 0.1:
        meaningful_candidates.append(col)
        print("  → MEANINGFUL MISSING")

print("\nИтог: meaningful missing в колонках:", meaningful_candidates)


# # 1. Признаки с высоким % missing (>90%)
# high_missing = df.isnull().mean()
# candidates_drop_missing = high_missing[high_missing > 0.9]
# print("Признаки >90% missing (кандидаты на drop):")
# print(candidates_drop_missing)

# # 2. Полностью пустые (100% missing)
# full_missing = high_missing[high_missing == 1.0]
# print("\nПолностью пустые (обязательно drop):", full_missing.index.tolist())

# # 3. Низковариативные (почти константные — шум)
# low_variance = df.select_dtypes(include='number').var()
# candidates_low_var = low_variance[low_variance < 1e-5]
# print("\nНизкая variance (кандидаты на drop):")
# print(candidates_low_var)

# # 4. Высококоррелированные (>0.95 — redundancy)
# # Только чисто числовые колонки (float/int, без object/date)
# numeric_df = df.select_dtypes(include=['float64', 'int64', 'float32', 'int32'])

# # Если numeric_df пустой — проблема в типах, принудительно конвертируем подозрительные
# if numeric_df.empty:
#     print("Нет чисто numeric колонок — принудительная конвертация")
#     potential_numeric = df.select_dtypes(include='object').columns
#     for col in potential_numeric:
#         df[col] = pd.to_numeric(df[col], errors='coerce')  # строки → NaN
#     numeric_df = df.select_dtypes(include=np.number)

# # Корреляция (abs) только на numeric
# corr_matrix = numeric_df.corr().abs()

# # Upper triangle (избегаем дубликатов и диагонали)
# upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))

# # Безопасный способ: stack() → Series, затем фильтр (избегает mixed типов)
# high_corr_series = upper.stack()
# high_corr_pairs = high_corr_series.loc()[high_corr_series > 0.95]

# print("\nПары с |corr| > 0.95 (удалить один из пары):")
# if high_corr_pairs.empty:
#     print("Нет высококоррелированных пар (>0.95)")
# else:
#     print(high_corr_pairs)

# # Опционально: список уникальных признаков для удаления (выбери один из пары)
# to_drop_candidates = set()
# for (col1, col2) in high_corr_pairs.index:
#     # Логика: удаляем тот, у кого больше missing или меньше corr с target
#     missing1 = df[col1].isnull().mean()
#     missing2 = df[col2].isnull().mean()
#     if missing1 > missing2:
#         to_drop_candidates.add(col1)
#     else:
#         to_drop_candidates.add(col2)

# print("\nРекомендуемые к удалению из пар:", sorted(to_drop_candidates))

# # 5. Skewed признаки (>3 — кандидаты на log1p)
# skew = df.select_dtypes(include='number').skew()
# high_skew = skew[abs(skew) > 3]
# print("\nСильно skewed (|skew|>3, log1p):")
# print(high_skew)
#===============================================================================
#===============================================================================
# # 2. Корреляции
# corr = df.corr(numeric_only=True)
# sns.heatmap(corr, annot=True, cmap='coolwarm')
# plt.title('Correlation Heatmap')
# plt.show()
# print(corr['target'].sort_values(ascending=False))

# # 3. Boxplot по категориям
# sns.boxplot(x='adminarea', y='target', data=df)
# plt.title('Доход по регионам')
# plt.show()


# fig, axes = plt.subplots(1, 3, figsize=(18, 6))

# # 1. Обычная шкала
# sns.histplot(x=df['target'], kde=True, ax=axes[0])
# axes[0].set_title(f'Распределение дохода (skew={df["target"].skew():.2f})')

# # 2. Лог-шкала
# sns.histplot(x=df['target'], kde=True, log_scale=True, ax=axes[1])
# axes[1].set_title('Логарифмическая шкала')

# # 3. После log-transform
# sns.histplot(x=np.log1p(df['target']), kde=True, ax=axes[2])
# axes[2].set_title('log1p(target) — ближе к нормальному')

# plt.tight_layout()
# plt.show()