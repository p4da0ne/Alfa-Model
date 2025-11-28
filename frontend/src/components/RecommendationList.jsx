export default function RecommendationList({ items }) {
    return (
      <div
        style={{
          background: "#eef",
          padding: 20,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h3>Персональные финансовые предложения:</h3>
        <ul>
          {items.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
    );
  }