import axios from "axios";
import Constants from "expo-constants";
import { getAccessToken } from "@/storage/tokenStorage";

// URL del backend
// Android Emulator:
// http://10.0.2.2:8080/api

// Dispositivo físico:
// http://192.168.X.X:8080/api

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  "http://10.0.2.2:8080/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Agrega automáticamente el JWT
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;