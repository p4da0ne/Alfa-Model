import { useState, useRef, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import PredictionCard from "../components/PredictionCard";
import SHAPChart from "../components/SHAPChart";
import RecommendationList from "../components/RecommendationList";
import { fetchClientData } from "../api/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");
  const [searchResetTrigger, setSearchResetTrigger] = useState(0);
  const abortControllerRef = useRef(null);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSearch = async (clientId) => {
    // Отменяем предыдущий запрос, если он еще выполняется
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController для текущего запроса
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Сохраняем ссылку на signal для этого конкретного запроса
    const currentSignal = abortController.signal;

    setLoading(true);
    setError("");
    setClient(null);

    try {
      const response = await fetchClientData(clientId, currentSignal);
      
      // Проверяем, не был ли запрос отменен (используем сохраненный signal)
      if (!currentSignal.aborted) {
        setClient(response);
        // Триггер для очистки поля поиска после успешного запроса
        setSearchResetTrigger(prev => prev + 1);
      }
    } catch (error) {
      // Игнорируем ошибку, если запрос был отменен (используем сохраненный signal)
      if (error.name === 'AbortError' || error.name === 'CanceledError' || currentSignal.aborted) {
        return;
      }
      
      setError("Не удалось загрузить данные");
      console.error("Ошибка загрузки данных:", error);
    } finally {
      // Обновляем состояние загрузки только если это последний запрос (не был отменен)
      // Проверяем, что текущий controller все еще активен
      if (abortControllerRef.current === abortController && !currentSignal.aborted) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="alfa-dashboard-container">
      <h1 className="alfa-dashboard-title">AI-Доход & Финансовые рекомендации</h1>
      
      <SearchBar onSearch={handleSearch} resetTrigger={searchResetTrigger} />

      {loading && <p className="alfa-loading">Загрузка...</p>}
      {error && <p className="alfa-error">{error}</p>}

      {client && (
        <div className="alfa-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <PredictionCard data={client} />
            <SHAPChart shap={client.shap_values} />
          </div>
          <RecommendationList items={client.recommendations} />
        </div>
      )}
    </div>
  );
}