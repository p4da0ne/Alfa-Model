export default function RecommendationList({ items = [] }) {
  const defaultItems = [
    "Премиальная карта Alfa Premium World → +14 000 ₽ кэшбэка",
    "Инвестпортфель «Рост 2026» → прогноз +19.4%",
    "Кредит под 9.9% на авто → одобрение за 3 мин"
  ];

  const list = items.length > 0 ? items : defaultItems;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' }}>
      {list.map((text, i) => (
        <div key={i} className="alfa-recommendation-card alfa-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>{text.split('→')[0]}</h3>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#FF3366' }}>
            → {text.split('→')[1]}
          </p>
        </div>
      ))}
    </div>
  );
}