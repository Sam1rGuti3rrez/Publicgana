"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

export function LogoutButton({ className = "" }: { className?: string }) {
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
    <div className="text-left">
    <button
      className={`flex h-10 w-full items-center gap-2 rounded-xl px-4 text-sm text-[#ffb4ab] hover:bg-[#93000a]/40 hover:text-[#ffdad6] disabled:opacity-60 ${className}`}
      disabled={cerrando}
      onClick={cerrarSesion}
      type="button"
    >
      <FiLogOut className="h-[18px] w-[18px] shrink-0" />
      {cerrando ? "Cerrando..." : "Cerrar sesión"}
    </button>
      {error && <p className="mt-1 text-xs text-[#FCA5A5]">{error}</p>}
    </div>
  );
}