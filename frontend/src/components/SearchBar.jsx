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
      className="flex gap-3 items-center bg-[#1A1A1A] p-4 rounded-xl shadow-lg"
    >
      <input
        type="text"
        placeholder="Введите client_id"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="flex-1 bg-black text-white p-3 rounded-lg border border-red-600"
      />

      <button
        type="submit"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
      >
        Найти
      </button>
    </form>
  );
}