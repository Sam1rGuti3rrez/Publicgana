import { useState } from "react";

export type HomeMode = "usuario" | "empresa";

export function useHomeMode() {
  const [mode, setMode] = useState<HomeMode>("usuario");
  return { mode, setMode };
}
