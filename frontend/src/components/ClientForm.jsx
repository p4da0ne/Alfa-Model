// src/components/ClientForm.jsx
import { useState } from "react";

export default function ClientForm({ onSubmit }) {
  const [age, setAge] = useState("");
  const [employment, setEmployment] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!age || !employment || !score) return; // Простая валидация
    setLoading(true);
    onSubmit({ age: Number(age), employment, score: Number(score) });
    setTimeout(() => setLoading(false), 1200); // Симуляция загрузки
    setAge("");
    setEmployment("");
    setScore("");
  };

  return (
    <form className="client-form-card" onSubmit={handleSubmit}>
      <h3 className="form-title">Введите данные клиента</h3>
      <input
        className="form-input"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Возраст"
        type="number"
      />
      <input
        className="form-input"
        value={employment}
        onChange={(e) => setEmployment(e.target.value)}
        placeholder="Тип занятости (например, 'IT-специалист')"
      />
      <input
        className="form-input"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Кредитный скоринг"
        type="number"
      />
      <button type="submit" className="form-submit-btn" disabled={loading}>
        {loading ? (
          <span className="loading-spinner">Предсказываем...</span>
        ) : (
          "Предсказать доход"
        )}
      </button>
    </form>
  );
}