// src/components/SearchBar.jsx
import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, resetTrigger }) {
  const [id, setId] = useState("");

  useEffect(() => {
    if (resetTrigger > 0) {
      queueMicrotask(() => setId(""));
    }
  }, [resetTrigger]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id.trim()) return;
    onSearch(id);
  };

  return (
    <>
      <input
        type="text"
        className="search-input"
        placeholder="client_id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleSubmit} className="search-button">
        Найти
      </button>
    </>
  );
}