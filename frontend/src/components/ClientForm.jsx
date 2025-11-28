import { useState } from "react";

export default function ClientForm({ onSubmit }) {
  const [age, setAge] = useState("");
  const [employment, setEmployment] = useState("");
  const [score, setScore] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      age: Number(age),
      employment,
      score: Number(score),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 24,
        padding: 16,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h3>Введите параметры клиента</h3>

      <input
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Возраст"
        type="number"
      />

      <input
        value={employment}
        onChange={(e) => setEmployment(e.target.value)}
        placeholder="Тип занятости"
      />

      <input
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Кредитный скоринг"
        type="number"
      />

      <button type="submit" style={{ marginTop: 12 }}>
        Предсказать
      </button>
    </form>
  );
}