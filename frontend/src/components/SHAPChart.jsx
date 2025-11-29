// src/components/SHAPChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SHAPChart({ shap }) {
  if (!shap || (Array.isArray(shap) && shap.length === 0)) {
    return (
      <div className="shap-card">
        <h3 className="shap-title">Вклад фич в решение</h3>
        <p className="shap-placeholder">Нет данных</p>
      </div>
    );
  }

  let chartData;
  if (Array.isArray(shap)) {
    chartData = shap.map((item, i) => ({
      name: item.feature ?? item.name ?? `Фича ${i + 1}`,
      value: Math.abs(item.value ?? item.shap_value ?? 0),
      raw: item.value ?? item.shap_value ?? 0
    }));
  } else {
    chartData = Object.entries(shap).map(([key, val]) => ({
      name: key,
      value: Math.abs(val),
      raw: val
    }));
  }

  return (
    <div className="shap-card fade-in">
      <h3 className="shap-title">SHAP: Вклад фич</h3>
      <div className="shap-chart">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <XAxis 
              dataKey="name" 
              stroke="#aaa" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tick={{ fontSize: 13 }}
            />
            <YAxis stroke="#aaa" />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(20,20,40,0.9)', 
                border: '1px solid #FF003D', 
                borderRadius: 16,
                backdropFilter: 'blur(20px)'
              }}
              formatter={(v, n, p) => [`${p.payload.raw > 0 ? '+' : ''}${p.payload.raw.toFixed(3)}`, n]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, i) => (
                <cell key={i} fill={entry.raw > 0 ? '#FF3366' : '#FF003D'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}