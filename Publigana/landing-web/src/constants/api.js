export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  CAMPAIGNS: {
    LIST: "/campaigns",
    DETAIL: (campaignId) => `/campaigns/${campaignId}`,
    CREATE: "/campaigns",
  },
};
