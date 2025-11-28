import { useState } from "react";
import ClientForm from "../components/ClientForm";
import PredictionCard from "../components/PredictionCard";
import RecommendationList from "../components/RecommendationList";
import SHAPChart from "../components/SHAPChart";
import { predictIncome, getRecommendations, getShapValues } from "../api/api";

export default function Dashboard() {
  const [income, setIncome] = useState(null);
  const [recs, setRecs] = useState([]);
  const [shap, setShap] = useState([]);

  const handlePredict = async (data) => {

    const inc = await predictIncome(data);
    setIncome(inc.prediction);

    const r = await getRecommendations(inc.client_id || 1);
    setRecs(r);

    const shapData = await getShapValues(data);
    setShap(shapData.values);
  };

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>AI-Доход + Финансовые рекомендации</h1>

      <ClientForm onSubmit={handlePredict} />

      {income && <PredictionCard value={income} />}

      {recs.length > 0 && <RecommendationList items={recs} />}

      {shap.length > 0 && <SHAPChart data={shap} />}
    </div>
  );
}