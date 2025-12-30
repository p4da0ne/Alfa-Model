import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer

# 1. Список колонок по категориям (на основе нашего анализа)
COLS_TO_DROP = [
    'id', 'dt',                          # leakage / no predictive power
    'turn_fdep_db_avg_act_v2', 'turn_fdep_db_avg_v2', 'turn_fdep_db_sum_v2',
    'avg_by_category__amount__sum__cashflowcategory_name__platezhi_cherez_internet',
    'avg_by_category__amount__sum__cashflowcategory_name__reklama_v_internete',
    'avg_by_category__amount__sum__cashflowcategory_name__zarubezhnye_finansovye_operatsii',
    'avg_by_category__amount__sum__cashflowcategory_name__oteli',
    'dp_ewb_dismissal_due_contract_violation_by_lb_cnt',
    'dp_ils_days_ip_share_5y', 'turn_cur_db_avg_act_v2', 'dp_ils_paymentssum_avg_6m', 'dp_ils_paymentssum_avg_6m_current', 'avg_cur_db_turn', 'turn_cur_cr_sum_v2', 'turn_cur_db_sum_v2',
    'turn_cur_db_max_v2', 'turn_cur_db_avg_v2', 'dp_ils_avg_salary_2y', 'dp_ils_paymentssum_avg_6m_current', 'avg_debet_turn_rur', 'dp_ils_accpayment_avg_6m_current', 'dp_ils_accpayment_avg_6m',
    'turn_cur_db_min_v2', 'hdb_other_active_max_psk', 'mob_cover_days', 'dp_payoutincomedata_payout_sum_3_month', 'dp_payoutincomedata_payout_avg_3_month', 'amount_by_category_90d__summarur_amt__sum__cashflowcategory_name__vydacha_nalichnyh_v_bankomate',
    'min_balance_rur_amt_1m_af', 'dp_payoutincomedata_payout_sum_3_month', 'avg_amount_daily_transactions_90d', 'turn_other_cr_sum_v2', 'period_last_act_ad'
]

# Категориальные (оставляем как есть, CatBoost обработает)
CAT_COLS = [
    "gender",
    "adminarea",
    "incomeValueCategory",
    "dp_ewb_last_organization",
    "dp_ewb_last_employment_position",
    "city_smart_name",
    "addrref",
    "accountsalary_out_flag",
    "blacklist_flag",
    "nonresident_flag",
    "client_active_flag"
]

# Числовые, где будем создавать missing indicators (50–90% missing, meaningful)
MISSING_INDICATOR_COLS = [
    'salary_6to12m_avg', 'first_salary_income',
    'hdb_bki_total_max_limit', 'hdb_bki_total_cc_max_limit',
    'hdb_bki_total_pil_max_limit', 'hdb_bki_total_ip_max_limit', 'hdb_bki_total_max_overdue_sum',
    'hdb_bki_total_pil_max_overdue', 'hdb_bki_total_cc_max_overdue', 'hdb_outstand_sum', 'hdb_relend_outstand_sum', 'hdb_ovrd_sum',
    'loan_cnt', 'total_sum', 'avg_loan_cnt_with_insurance', 'per_capita_income_rur_amt', 'hdb_relend_active_max_psk', 'hdb_other_active_max_psk', 
    'min_balance_rur_amt_6m_af', 'min_balance_rur_amt_1m_af', 'avg_balance_rur_amt_1m_af', 'max_balance_rur_amt_1m_af'
]

# Числовые для log1p (skewed, positive values)
LOG_TRANSFORM_COLS = [
    'turn_cur_cr_avg_act_v2', 'turn_cur_cr_sum_v2',
    'turn_cur_db_sum_v2', 'curr_rur_amt_cm_avg',
    'salary_6to12m_avg', 'hdb_bki_total_max_limit', 'dp_ils_paymentssum_avg_12m',
    'hdb_bki_active_cc_max_overdue', 'total_rur_amt_cm_avg_period_days_ago_v2', 
    'label_Above_1M_share_r1', 'max_balance_rur_amt_1m_af', 'first_salary_income'
]



def create_feature_pipeline(df: pd.DataFrame, inference: bool = False) -> pd.DataFrame:
    """
    Полный пайплайн feature engineering.
    Возвращает обработанный DataFrame готовый для CatBoost.
    """
    df = df.copy()
    
    # 1. Удаление ненужных колонок
    df.drop(columns=COLS_TO_DROP, errors='ignore', inplace=True)

    # 2. Missing indicators (очень полезно в финансах)
    for col in MISSING_INDICATOR_COLS:
        if col in df.columns:
            df[f"{col}_missing"] = df[col].isnull().astype(int)
    
    # 3. Log1p трансформ для skewed положительных признаков
    def safe_log1p(series: pd.Series) -> pd.Series:
        # Принудительно numeric, None/строки → NaN
        s = pd.to_numeric(series, errors='coerce')
        s = s.clip(lower=0)
        return np.log1p(s)  # NaN остаются NaN, работает корректно
    
    for col in LOG_TRANSFORM_COLS:
        if col in df.columns:
            df[f"{col}_log"] = safe_log1p(df[col])
    
    # 4. (Опционально) Комбинированный salary_proxy — уменьшаем redundancy
    salary_cols = ['salary_6to12m_avg', 'first_salary_income', 'incomeValue']
    available_salary = [c for c in salary_cols if c in df.columns]
    if available_salary:
        df['salary_proxy'] = df[available_salary].median(axis=1)  # robust к missing
    
    # 5. Target log1p (для обучения, не для inference!)
    # Делаем отдельно: y = np.log1p(df['target'])

    # print("После обработки:", df.columns.tolist())

    return df

# # Пример использования
# df_raw = pd.read_parquet('ml-resources/hackathon_income_test_processed.parquet')

# df_features = create_feature_pipeline(df_raw)

# # Для обучения
# X = df_features.drop(columns=['target'])
# y = np.log1p(df_features['target']) 

# cat_features_indices = [X.columns.get_loc(c) for c in CAT_COLS if c in X.columns]

# print("Shape после пайплайна:", X.shape)
# print("Новые признаки пример:", X.filter(like='_missing').columns.tolist())
# print("Лог-признаки:", X.filter(like='_log').columns.tolist())