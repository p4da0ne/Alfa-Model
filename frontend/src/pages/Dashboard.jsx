import ClientForm from '../components/ClientForm';
import PredictionCard from '../components/PredictionCard';
import RecommendationList from '../components/RecommendationList';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';

export default function Dashboard() {
  const [predictionData, setPredictionData] = useState(null);

  const handlePredict = (formData) => {
    // Здесь будет твой API
    setTimeout(() => {
      setPredictionData({
        name: "Петров Пётр",
        prediction: 5820000,
        kpi: 42
      });
    }, 1000);
  };

  return (
    <>
      <div className="glass-layer" />
      <div className="alfa-dashboard-container">
        <h1 className="alfa-dashboard-title">ALFA Buisness</h1>

        <SearchBar />
        <ClientForm onSubmit={handlePredict} />
        <PredictionCard data={predictionData} />
        <RecommendationList items={[]} />
      </div>
    </>
  );
}