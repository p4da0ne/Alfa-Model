// src/pages/Dashboard.jsx
import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import PredictionCard from '../components/PredictionCard';
import RecommendationList from '../components/RecommendationList';
import SHAPChart from '../components/SHAPChart';
import EmptyStateCards from '../components/EmptyStateCards';
import { predictIncome } from '../api/api';

export default function Dashboard() {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Функция для определения сегмента клиента на основе дохода
  const getSegment = (income) => {
    if (income >= 5000000) return "Ultra Premium";
    if (income >= 2000000) return "Premium";
    if (income >= 1000000) return "Gold";
    if (income >= 500000) return "Silver";
    return "Standard";
  };

  // Функция для форматирования названий признаков для отображения
  const formatFeatureName = (key) => {
    const featureNames = {
      "incomeValue": "Текущий доход",
      "age": "Возраст",
      "adminarea": "Регион",
      "gender": "Пол",
      "salary_6to12m_avg": "Средняя зарплата (6-12 мес)",
      "dp_ils_avg_salary_1y": "Средняя зарплата за год",
      "hdb_bki_total_max_limit": "Максимальный лимит по БКИ",
      "turn_cur_cr_avg_act_v2": "Оборот по кредитам",
      "dp_ils_paymentssum_avg_12m": "Средние платежи за 12 мес",
    };
    return featureNames[key] || key;
  };

  const handleSearch = async (id) => {
    if (!id?.trim()) return;
    
    setClientData(null);
    setError(null);
    setLoading(true);

    try {
      // Пытаемся использовать client_id, если это число
      const clientId = parseInt(id.trim());
      let requestPayload;
      
      if (!isNaN(clientId)) {
        // Если введен числовой ID, используем client_id
        requestPayload = { client_id: clientId };
      } else {
        // Если не число, возвращаем ошибку
        throw new Error("Введите числовой ID клиента или используйте форму для ввода параметров");
      }

      const response = await predictIncome(requestPayload);
      
      // Преобразуем данные из API в формат компонентов
      const formattedData = {
        name: `Клиент #${id.trim()}`,
        prediction: Math.round(response.prediction),
        kpi: Math.round(response.income_raise || 0),
        confidence: Math.round(response.confidence || 0),
        segment: getSegment(response.prediction),
        shap: response.shap_top || response.shap_values || {},
        shapFormatted: Object.entries(response.shap_top || response.shap_values || {}).reduce((acc, [key, value]) => {
          acc[formatFeatureName(key)] = value;
          return acc;
        }, {})
      };

      setClientData(formattedData);
    } catch (err) {
      console.error('Ошибка при получении предсказания:', err);
      setError(err.response?.data?.detail || err.message || 'Произошла ошибка при получении предсказания');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setClientData(null);
    setError(null);
  };

  const stars = useMemo(() => {
    // Используем сидированный псевдослучайный генератор для стабильности между рендерами
    function seededRandom(seed) {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }
    return [...Array(60)].map((_, i) => {
      const randomTop = 10 + seededRandom(i * 5 + 1) * 130;
      const randomDelay = seededRandom(i * 5 + 2) * 8;
      const randomDuration = 5 + seededRandom(i * 5 + 3) * 6;
      const isBig = seededRandom(i * 5 + 4) > 0.7;
      const isBright = seededRandom(i * 5 + 5) > 0.5;
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
        <SearchBar onSearch={handleSearch} disabled={loading} />

        {error && (
          <div className="error-message" style={{
            background: 'rgba(255, 0, 61, 0.1)',
            border: '1px solid #FF003D',
            borderRadius: '12px',
            padding: '16px',
            margin: '20px 0',
            color: '#FF6699'
          }}>
            <strong>Ошибка:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading-message" style={{
            textAlign: 'center',
            padding: '40px',
            color: '#FF6699',
            fontSize: '18px'
          }}>
            <div className="loading-spinner" style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255, 102, 153, 0.3)',
              borderTop: '4px solid #FF6699',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }}></div>
            <p>Анализируем данные клиента...</p>
          </div>
        )}

        {!clientData && !loading ? (
          <EmptyStateCards />
        ) : clientData ? (
          <>
            <div className="result-container">
              <PredictionCard data={clientData} />
              <SHAPChart shap={clientData.shapFormatted || clientData.shap} />
              <RecommendationList items={[]} />
            </div>

            {/* КНОПКА НА ГЛАВНУЮ */}
            <button onClick={handleBack} className="back-to-home-btn">
              ← На главную
            </button>
          </>
        ) : null}
      </div>
    </>
  );
}