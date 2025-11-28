export default function PredictionCard({ data }) {
  if (!data) {
    return (
      <div className="bg-[#1A1A1A] border border-red-700 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Прогноз дохода</h2>
        <p className="text-gray-400">Нет данных</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-red-700 p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4">Прогноз дохода</h2>
      
      <div className="text-4xl font-bold text-red-500">
        {data.prediction ?? 'N/A'} ₽
      </div>

      <p className="text-gray-400 mt-2">
        KPI изменения дохода: 
        <span className="text-white font-semibold"> {data.kpi ?? 'N/A'}%</span>
      </p>
    </div>
  );
}