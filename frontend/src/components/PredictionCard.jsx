export default function PredictionCard({ value }) {
    return (
      <div
        style={{
          background: "#f5f5f5",
          padding: 20,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h3>Прогнозируемый доход:</h3>
        <p style={{ fontSize: 24, fontWeight: "bold" }}>{value} ₽</p>
      </div>
    );
  }