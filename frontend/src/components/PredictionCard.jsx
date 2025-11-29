export default function PredictionCard({ data }) {
  if (!data) {
    return (
      <div className="alfa-card">
        <h2>Прогноз дохода</h2>
        <p>Нет данных</p>
      </div>
    );
  }

  return (
    <div className="alfa-card">
      <h2>Прогноз дохода</h2>
      
      <div className="alfa-prediction-highlight">
        {data.prediction ?? 'N/A'} ₽
      </div>

      <p>
        KPI изменения дохода: 
        <span className="alfa-kpi-indicator"> {data.kpi ?? 'N/A'}%</span>
      </p>
    </div>
  );
}