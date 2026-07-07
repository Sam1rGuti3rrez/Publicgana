import axios from "axios";
import { API_CONFIG } from "../constants/api";

const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosClient;
