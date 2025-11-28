# Проект: Alfa-Model - прогноз дохода клиентов и рекомендации клиентам
Модель для прогноза доходов клиентов банка с веб-интерфейсом
## Team: 
1. Frontend - https://t.me/wllmr0
2. Backend - https://t.me/p4da1s
3. ML - https://t.me/Scrip0_chka

## 🚀 Возможности (What this project does)
- 📈 Прогноз дохода клиента
- 🤖 ML модель (LightGBM + WMAE)
- 🧠 SHAP объяснения
- 💳 Генератор персональных финансовых предложений
- 📊 Мониторинг качества модели (WMAE, CTR)
- 🖥 Современный веб-интерфейс (React + Tailwind)

## 🧩 Архитектура решения
(схема, можно ASCII, можно картинку)

---

## 💡 Бизнес-ценность
(почему банку важно ваше решение — 5–6 предложений)

---

## 🛠 Технологии
- Python, FastAPI
- LightGBM, SHAP
- React + Tailwind
- Docker, docker-compose

---

## 📦 Запуск проекта
### 🔧 1. Клонирование

```bash
git clone https://github.com/user/project.git
cd project
```
## Run:
  - pip install -r requirements.txt
  - python src/ml/train.py   # trains model and saves model.pkl
  - uvicorn src.api.main:app --reload --port 8000  # starts backend
  - cd src/frontend && npm start  # runs react app
## Submission:
  python src/ml/make_submission.py --model model.pkl --out submissions/sub1.csv