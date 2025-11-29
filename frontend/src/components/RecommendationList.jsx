// src/components/RecommendationList.jsx
export default function RecommendationList({ items = [] }) {
  const defaultItems = [
    { title: "Black Edition", desc: "+14 000 ₽ кэшбэк" },
    { title: "Ипотека 7.2%", desc: "Одобрение за 3 мин" },
    { title: "Инвестпортфель", desc: "+28.4% годовых" }
  ];

  const list = items.length > 0 ? items : defaultItems;

  return (
    <div className="recommendations-grid">
      {list.map((item, i) => (
        <div key={i} className="reco-card fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
          <h3 className="reco-title">{item.title}</h3>
          <p className="reco-desc">{item.desc}</p>
          <div className="reco-shine" />
        </div>
      ))}
    </div>
  );
}