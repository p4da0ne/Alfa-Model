// src/pages/Dashboard.jsx — только добавлена кнопка
import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import PredictionCard from '../components/PredictionCard';
import RecommendationList from '../components/RecommendationList';
import SHAPChart from '../components/SHAPChart';
import EmptyStateCards from '../components/EmptyStateCards';

export default function Dashboard() {
  const [clientData, setClientData] = useState(null);

  const handleSearch = (id) => {
    if (!id?.trim()) return;
    setClientData(null);
    setTimeout(() => {
      setClientData({
        name: "Александр Смирнов",
        prediction: 7842920,
        kpi: 38,
        confidence: 96,
        segment: "Ultra Premium"
      });
    }, 2200);
  };

  const handleBack = () => setClientData(null);

  const stars = useMemo(() => {
    return [...Array(60)].map((_, i) => {
      const randomTop = 10 + Math.random() * 130;
      const randomDelay = Math.random() * 8;
      const randomDuration = 5 + Math.random() * 6;
      const isBig = Math.random() > 0.7;
      const isBright = Math.random() > 0.5;
      return {
        id: i,
        left: `${i * 1.7}%`,
        top: `${randomTop}px`,
        size: isBig ? '3px' : '2px',
        opacity: isBright ? 0.9 : 0.6,
        delay: `${randomDelay}s`,
        duration: `${randomDuration}s`
      };
    });
  }, []);

  return (
    <>
      <div className="stardust">
        {stars.map(star => (
          <div key={star.id} className="star" style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration
          }} />
        ))}
      </div>

      <div className="glass-layer" />
      <div className="orbs-container">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <div className="alfa-dashboard-container">
        <h1 className="alfa-title">АЛЬФА</h1>
        <p className="alfa-subtitle">Income Prediction Intelligence</p>
        <SearchBar onSearch={handleSearch} />

        {!clientData ? (
          <EmptyStateCards />
        ) : (
          <>
            <div className="result-container">
              <PredictionCard data={clientData} />
              <SHAPChart shap={{
                "Доход по НДФЛ": 2.41,
                "Трудовая книжка": 1.82,
                "Скоринг партнёров": 1.21,
                "Возраст": -0.44,
                "Регион": 0.67
              }} />
              <RecommendationList items={[]} />
            </div>

            {/* КНОПКА НА ГЛАВНУЮ */}
            <button onClick={handleBack} className="back-to-home-btn">
              ← На главную
            </button>
          </>
        )}
      </div>
    </>
  );
}