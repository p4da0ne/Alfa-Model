// src/components/PredictionCard.jsx
export default function PredictionCard({ data }) {
  if (!data) {
    return (
      <div className="prediction-main-card">
        <h2 className="card-title">Прогноз дохода</h2>
        <p className="card-placeholder">Введите данные клиента для точного расчёта</p>
      </div>
    );
  }

  return (
    <div className="prediction-main-card">
      <div className="client-header">
        <div className="client-avatar" />
        <div className="client-info">
          <h2 className="client-name">{data.name || "Иванов Иван Иванович"}</h2>
          <div className="prediction-value">
            Прогнозируемый доход: {data.prediction.toLocaleString()} ₽
          </div>
          <div className="kpi-section">
            Изменение дохода: <span className="kpi-badge">+{data.kpi}%</span>
          </div>
          <div className="extra-stats">
            Уверенность: {data.confidence}% | Сегмент: {data.segment}
          </div>
        </div>
      </div>
    </div>
  );
}