// src/components/SearchBar.jsx
import { useState } from "react";

export default function SearchBar({ onSearch, disabled = false }) {
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim() && !disabled) onSearch(id);
  };

  return (
    <form onSubmit={handleSubmit} className="search-wrapper">
      <input
        type="text"
        className="search-input"
        placeholder="Введите клиент-айди (число)"
        value={id}
        onChange={(e) => setId(e.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="search-btn" disabled={disabled}>
        {disabled ? "Анализ..." : "Анализ"}
      </button>
    </form>
  );
}