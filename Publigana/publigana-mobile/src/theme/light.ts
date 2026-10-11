import {
  DefaultTheme,
  Theme,
} from "@react-navigation/native";

export const lightTheme: Theme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,

    primary: "#7B2FBE",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#111827",
    border: "#E5E7EB",
    notification: "#F5A623",
  },
};