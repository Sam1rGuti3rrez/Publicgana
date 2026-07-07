import apiClient from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const campaignService = {
  list(params = {}) {
    return apiClient.get(API_ENDPOINTS.CAMPAIGNS.LIST, { params });
  },
  getById(campaignId) {
    return apiClient.get(API_ENDPOINTS.CAMPAIGNS.DETAIL(campaignId));
  },
  create(payload) {
    return apiClient.post(API_ENDPOINTS.CAMPAIGNS.CREATE, payload);
  },
};
