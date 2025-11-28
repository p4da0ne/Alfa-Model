# Проект: Alfa-Model - прогноз дохода клиентов и рекомендации клиентам
Модель для прогноза доходов клиентов банка с веб-интерфейсом
## Team: 
1. https://t.me/wllmr0
2. https://t.me/p4da1s
3. https://t.me/Scrip0_chka

## Run:
  - pip install -r requirements.txt
  - python src/ml/train.py   # trains model and saves model.pkl
  - uvicorn src.api.main:app --reload --port 8000  # starts backend
  - cd src/frontend && npm start  # runs react app
## Submission:
  python src/ml/make_submission.py --model model.pkl --out submissions/sub1.csv