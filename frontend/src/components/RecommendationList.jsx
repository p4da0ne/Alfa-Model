export default function RecommendationList({ items }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="bg-[#1A1A1A] p-6 border border-red-700 rounded-2xl shadow-xl">
        <h2 className="text-xl text-white font-bold mb-4">Рекомендации</h2>
        <p className="text-gray-400">Нет рекомендаций</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] p-6 border border-red-700 rounded-2xl shadow-xl">
      <h2 className="text-xl text-white font-bold mb-4">Рекомендации</h2>

      <ul className="space-y-4">
        {items.map((rec, i) => (
          <li 
            key={i}
            className="bg-black p-4 rounded-xl border border-red-800 text-gray-200"
          >
            {rec}
          </li>
        ))}
      </ul>
    </div>
  );
}