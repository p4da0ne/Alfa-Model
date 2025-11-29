// src/components/SearchBar.jsx
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim()) onSearch(id);
  };

  return (
    <form onSubmit={handleSubmit} className="search-wrapper">
      <input
        type="text"
        className="search-input"
        placeholder="Введите клиент-айди"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button type="submit" className="search-btn">
        Анализ
      </button>
    </form>
  );
}