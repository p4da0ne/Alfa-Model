import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, resetTrigger }) {
  const [id, setId] = useState("");

  // Очистка поля при изменении resetTrigger (только после успешного поиска)
  useEffect(() => {
    if (resetTrigger > 0) {
      setId("");
    }
  }, [resetTrigger]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id.trim()) return;
    onSearch(id);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="alfa-search-bar"
    >
      <input
        type="text"
        placeholder="Введите client_id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button
        type="submit"
      >
        Найти
      </button>
    </form>
  );
}