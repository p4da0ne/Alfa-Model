import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const predictIncome = async (features) => {
  const res = await api.post("/predict", features);
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

export const fetchClientData = async (clientId) => {
  const res = await api.get(`/client/${clientId}`);
  return res.data;
};