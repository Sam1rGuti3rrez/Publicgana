import axios from "axios";
import { Platform } from "react-native";
import { getAccessToken } from "@/storage/tokenStorage";

const getDefaultApiUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/api";
  }

  return "http://localhost:3000/api";
};

const API_URL =
  (process.env.EXPO_PUBLIC_API_URL ?? getDefaultApiUrl()).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;