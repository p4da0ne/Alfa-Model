// src/components/SHAPChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SHAPChart({ shap }) {
  if (!shap || (Array.isArray(shap) && shap.length === 0) || typeof shap !== "object") {
    return (
      <div className="shap-chart-card">
        <h2 className="card-title">Вклад факторов (SHAP)</h2>
        <p className="card-placeholder">Данные появятся после предсказания</p>
      </div>
    );
  }

  let chartData;
  if (Array.isArray(shap)) {
    chartData = shap.map((item, index) => ({
      name: item.feature ?? item.name ?? `Фактор ${index + 1}`,
      value: item.value ?? item.shap_value ?? 0,
    }));
  } else {
    chartData = Object.entries(shap).map(([key, val]) => ({
      name: key,
      value: val,
    }));
  }

  return (
    <div className="shap-chart-card">
      <h2 className="card-title">Вклад факторов (SHAP)</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#FF6699" />
            <YAxis stroke="#FF6699" />
            <Tooltip 
              contentStyle={{ background: 'rgba(20,20,40,0.9)', border: '1px solid #FF003D', color: '#fff' }} 
              cursor={{ fill: 'rgba(255,0,61,0.1)' }}
            />
            <Bar dataKey="value" fill="#FF003D" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}