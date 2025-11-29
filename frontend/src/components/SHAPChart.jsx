import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SHAPChart({ shap }) {
  if (!shap || typeof shap !== 'object') {
    return (
      <div className="alfa-shap-chart-container">
        <h2>SHAP Contributions</h2>
        <p>Нет данных для отображения</p>
      </div>
    );
  }

  let chartData;
  
  // Обработка массива объектов
  if (Array.isArray(shap)) {
    if (shap.length === 0) {
      return (
        <div className="alfa-shap-chart-container">
          <h2>SHAP Contributions</h2>
          <p>Нет данных для отображения</p>
        </div>
      );
    }
    // Если массив объектов с полями feature/value или name/value
    chartData = shap.map((item, index) => ({
      name: item.feature ?? item.name ?? `Feature ${index}`,
      value: item.value ?? item.shap_value ?? 0,
    }));
  } else {
    // Обработка объекта (ключ-значение)
    chartData = Object.entries(shap).map(([key, val]) => ({
      name: key,
      value: val,
    }));
  }

  return (
    <div className="alfa-shap-chart-container">
      <h2>SHAP Contributions</h2>

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