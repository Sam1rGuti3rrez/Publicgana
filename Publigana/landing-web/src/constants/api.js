export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    PROFILE: "/auth/profile",
  },
  CAMPAIGNS: {
    LIST: "/api/campaigns",
    DETAIL: (campaignId) => `/api/campaigns/${campaignId}`,
    CREATE: "/api/campaigns",
  },
};
