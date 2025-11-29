// src/components/ClientForm.jsx
import { useState } from "react";

export default function ClientForm({ onSubmit }) {
  const [age, setAge] = useState("");
  const [employment, setEmployment] = useState("");
  const [score, setScore] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!age || !employment || !score) return;
    onSubmit({ age: Number(age), employment, score: Number(score) });
  };

  return (
    <div className="form-glass-card">
      <h2 className="form-title">Анализ клиента</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <InputField
          label="Возраст"
          type="number"
          value={age}
          onChange={setAge}
          placeholder="35"
        />
        <InputField
          label="Тип занятости"
          type="text"
          value={employment}
          onChange={setEmployment}
          placeholder="Официально, ИП, самозанятый..."
        />
        <InputField
          label="Кредитный скоринг"
          type="number"
          value={score}
          onChange={setScore}
          placeholder="720"
        />
        <button type="submit" className="predict-btn">
          <span>Предсказать доход</span>
          <div className="btn-glow" />
        </button>
      </form>
    </div>
  );
}

function InputField({ label, value, onChange, ...props }) {
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <input
        className="glass-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}