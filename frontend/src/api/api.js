import axios from "axios";

// Всегда используем относительный путь /api, который проксируется через nginx
// В Docker-окружении nginx проксирует /api/ на backend:8000
const getBaseURL = () => {
  // Если задан явный URL через переменную окружения, используем его
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // В продакшене и разработке используем относительный путь /api
  // Nginx проксирует /api/ на backend:8000
  return "/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функции для альтернативного функционала (прямой ввод параметров через форму)
// В настоящее время не используются, так как используется fetchClientData для получения всех данных сразу
// Могут быть использованы при интеграции ClientForm компонента

export const predictIncome = async (features) => {
  // Роутер имеет префикс /predict, endpoint это /, поэтому путь /predict/
  const res = await api.post("/predict/", features);
  return res.data;
};

export const getRecommendations = async (clientId) => {
  const res = await api.get(`/recommend/${clientId}`);
  return res.data;
};

export const getShapValues = async (features) => {
  const res = await api.post("/explain", features, {
    responseType: 'json',
  });
  return res.data;
};

export const fetchClientData = async (clientId, signal) => {
  const res = await api.get(`/client/${clientId}`, {
    signal: signal,
  });
  return res.data;
};