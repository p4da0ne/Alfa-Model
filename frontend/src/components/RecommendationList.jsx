export default function RecommendationList({ items }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="alfa-recommendations-container">
        <h2>Рекомендации</h2>
        <p>Нет рекомендаций</p>
      </div>
    );
  }

  return (
    <div className="alfa-recommendations-container">
      <h2>Рекомендации</h2>

      <div className="alfa-recommendations-grid">
        {items.map((rec, i) => (
          <div 
            key={i}
            className="alfa-recommendation-card"
          >
            {rec}
          </div>
        ))}
      </div>
    </div>
  );
}