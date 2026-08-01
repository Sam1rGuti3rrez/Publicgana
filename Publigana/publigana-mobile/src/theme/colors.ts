export const colors = {
  // Fondos
  background: "#0F0626",
  surface: "#1C0D42",
  card: "#261455",

  // Primarios
  primary: "#7B2FBE",
  primaryLight: "#A855F7",
  primaryDark: "#5B21B6",

  // Secundario / Acento dorado
  secondary: "#F5A623",
  gold: "#F5A623",
  goldLight: "#FFD166",
  goldDark: "#D97706",

  // Estados
  success: "#22C55E",
  warning: "#FACC15",
  danger: "#EF4444",
  error: "#EF4444",
  info: "#3B82F6",

  // Texto
  textPrimary: "#FFFFFF",
  textSecondary: "#C4B5FD",
  white: "#FFFFFF",
  muted: "#9D86C8",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray700: "#374151",

  // Bordes
  border: "#3B2A6D",

  // Inputs
  inputBackground: "#22104A",
  placeholder: "#A1A1AA",
} as const;

export type AppColors = typeof colors;