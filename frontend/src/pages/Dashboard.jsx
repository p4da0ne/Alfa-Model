// src/pages/Dashboard.jsx
import { useState } from 'react';
import ClientForm from '../components/ClientForm';
import PredictionCard from '../components/PredictionCard';
import RecommendationList from '../components/RecommendationList';
import SearchBar from '../components/SearchBar';

export default function Dashboard() {
  const [predictionData, setPredictionData] = useState(null);

  const handlePredict = (formData) => {
    setTimeout(() => {
      setPredictionData({
        name: "Петров Пётр Петрович",
        prediction: 5820000,
        kpi: 42,
        confidence: 94,
        segment: "Premium+"
      });
    }, 1200);
  };

  return (
    <>
      <div className="glass-layer" />
      
      <div className="alfa-dashboard-container">
        <h1 className="alfa-dashboard-title">ALFA</h1>
        
        <div className="search-container">
          <SearchBar />
        </div>

        <ClientForm onSubmit={handlePredict} />

        {predictionData && (
          <>
            <PredictionCard data={predictionData} />
            <RecommendationList items={[
              { title: "Кредитная карта Black Edition", desc: "Лимит до 5 млн ₽, кэшбэк 10% на всё" },
              { title: "Ипотека под 7.2%", desc: "Сниженная ставка благодаря точному скорингу дохода" },
              { title: "Инвестиционный счёт", desc: "Персональная стратегия с доходностью +28% годовых" },
            ]} />
          </>
        )}
      </div>
    </>
  );
}