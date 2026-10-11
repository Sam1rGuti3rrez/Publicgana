"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState("");

  async function cerrarSesion() {
    setCerrando(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (response.ok) {
        router.replace("/admin/login");
        router.refresh();
      } else {
        setError("No se pudo cerrar la sesión.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCerrando(false);
    }
  }

  return (
    <div className="text-right">
    <button
      className="rounded-md border border-[#514078] px-3 py-2 text-sm text-[#C9C0DE] hover:border-[#F5A623] hover:text-[#F6F1E7] disabled:opacity-60"
      disabled={cerrando}
      onClick={cerrarSesion}
      type="button"
    >
      {cerrando ? "Cerrando..." : "Cerrar sesión"}
    </button>
      {error && <p className="mt-1 text-xs text-[#FCA5A5]">{error}</p>}
    </div>
  );
}