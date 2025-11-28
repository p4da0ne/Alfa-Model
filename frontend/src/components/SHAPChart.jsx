import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SHAPChart({ shap }) {
  if (!shap || typeof shap !== 'object') {
    return (
      <div className="bg-[#1A1A1A] p-6 border border-red-700 rounded-2xl shadow-xl">
        <h2 className="text-xl text-white font-bold mb-3">SHAP Contributions</h2>
        <p className="text-gray-400">Нет данных для отображения</p>
      </div>
    );
  }

  let chartData;
  
  // Обработка массива объектов
  if (Array.isArray(shap)) {
    if (shap.length === 0) {
      return (
        <div className="bg-[#1A1A1A] p-6 border border-red-700 rounded-2xl shadow-xl">
          <h2 className="text-xl text-white font-bold mb-3">SHAP Contributions</h2>
          <p className="text-gray-400">Нет данных для отображения</p>
        </div>
      );
    }
    // Если массив объектов с полями feature/value или name/value
    chartData = shap.map((item, index) => ({
      name: item.feature || item.name || `Feature ${index}`,
      value: item.value || item.shap_value || 0,
    }));
  } else {
    // Обработка объекта (ключ-значение)
    chartData = Object.entries(shap).map(([key, val]) => ({
      name: key,
      value: val,
    }));
  }

  return (
    <div className="bg-[#1A1A1A] p-6 border border-red-700 rounded-2xl shadow-xl">
      <h2 className="text-xl text-white font-bold mb-3">SHAP Contributions</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value" fill="#ff2d2d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}