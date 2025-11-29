// src/components/RecommendationList.jsx
export default function RecommendationList({ items = [] }) {
  const defaultItems = [
    { title: "Премиальная карта Alfa Premium World", desc: "+14 000 ₽ кэшбэка" },
    { title: "Инвестпортфель «Рост 2026»", desc: "Прогноз +19.4%" },
    { title: "Кредит под 9.9% на авто", desc: "Одобрение за 3 мин" },
  ];
  const list = items.length > 0 ? items : defaultItems;

  return (
    <div className="recommendations-grid">
      {list.map((item, i) => (
        <div key={i} className="reco-card" style={{ animationDelay: `${i * 0.15}s` }}>
          <h3 className="reco-title">{item.title}</h3>
          <p className="reco-desc">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}