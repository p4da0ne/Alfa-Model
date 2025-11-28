import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function SHAPChart({ data }) {
  return (
    <div style={{ background: "#fefae0", padding: 20, borderRadius: 8 }}>
      <h3>Почему модель решила именно так?</h3>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="feature" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
}