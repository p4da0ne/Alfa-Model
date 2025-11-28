import { useState, useRef } from "react";
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

  const handleSearch = async (clientId) => {
    // Отменяем предыдущий запрос, если он еще выполняется
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController для текущего запроса
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError("");
    setClient(null);

    try {
      const response = await fetchClientData(clientId, abortController.signal);
      
      // Проверяем, не был ли запрос отменен
      if (!abortController.signal.aborted) {
        setClient(response);
        // Триггер для очистки поля поиска после успешного запроса
        setSearchResetTrigger(prev => prev + 1);
      }
    } catch (error) {
      // Игнорируем ошибку, если запрос был отменен
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        return;
      }
      
      // Проверяем, не был ли запрос отменен перед установкой ошибки
      if (!abortController.signal.aborted) {
        setError("Не удалось загрузить данные");
        console.error("Ошибка загрузки данных:", error);
      }
    } finally {
      // Обновляем состояние загрузки только если это последний запрос
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-10 bg-[#0D0D0D] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">AI-Доход + Финансовые рекомендации</h1>
      
      <SearchBar onSearch={handleSearch} resetTrigger={searchResetTrigger} />

      {loading && <p className="mt-6 text-gray-400">Загрузка...</p>}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      {client && (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PredictionCard data={client} />
            <SHAPChart shap={client.shap_values} />
          </div>
          <RecommendationList items={client.recommendations} />
        </div>
      )}
    </div>
  );
}