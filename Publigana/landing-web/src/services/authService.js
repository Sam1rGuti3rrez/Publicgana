import apiClient from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const authService = {
  login(payload) {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  },
  register(payload) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  },
  getProfile() {
    return apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
  },
};
