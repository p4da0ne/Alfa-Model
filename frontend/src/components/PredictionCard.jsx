export default function PredictionCard({ data }) {
  if (!data) {
    return (
      <div className="alfa-card alfa-fade-in">
        <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Прогноз дохода</h2>
        <p style={{ opacity: 0.6, fontSize: '20px' }}>Введите данные клиента</p>
      </div>
    );
  }

  return (
    <div className="alfa-card alfa-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
        <div className="alfa-avatar" />
        <div>
          <h2 style={{ fontSize: '36px', margin: '0 0 20px 0', opacity: 0.9 }}>
            {data.name || "Иванов Иван Иванович"}
          </h2>
          <div className="alfa-prediction-highlight">
            {(data.prediction || 4820000).toLocaleString()} ₽
          </div>
          <div style={{ marginTop: '20px', fontSize: '32px' }}>
            Изменение дохода:{' '}
            <span className="alfa-kpi-indicator">+{(data.kpi || 28)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}