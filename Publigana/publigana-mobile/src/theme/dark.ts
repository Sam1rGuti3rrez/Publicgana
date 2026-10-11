import {
  DarkTheme,
  Theme,
} from "@react-navigation/native";

export const darkTheme: Theme = {
  ...DarkTheme,

  colors: {
    ...DarkTheme.colors,

    primary: "#A855F7",
    background: "#0F0626",
    card: "#1C0D42",
    text: "#F0E8FF",
    border: "#2E1A61",
    notification: "#FFD166",
  },
};