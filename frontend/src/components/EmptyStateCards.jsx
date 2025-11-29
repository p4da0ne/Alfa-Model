// src/components/EmptyStateCards.jsx
export default function EmptyStateCards() {
  const facts = [
    {
      title: "200+ параметров",
      desc: "Модель использует цифровой профиль: трудовая книжка, НДФЛ, страховые взносы, скоры партнёров и сегменты клиентов"
    },
    {
      title: "3 поколения моделей",
      desc: "От 17 параметров в 2022 → 150+ в 2025. Точность выросла на 41%, риски снизились на 28%"
    },
    {
      title: "SHAP-интерпретируемость",
      desc: "Каждое предсказание объясняется: какие факторы повлияли на доход и почему"
    }
  ];

  return (
    <div className="project-grid">
      {facts.map((fact, i) => (
        <div key={i} className="project-card">
          <h3 className="project-title">{fact.title}</h3>
          <p className="project-desc">{fact.desc}</p>
        </div>
      ))}
    </div>
  );
}