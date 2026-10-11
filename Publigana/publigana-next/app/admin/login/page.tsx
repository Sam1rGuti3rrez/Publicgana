"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = {
  error?: string;
  usuario?: {
    rol?: string;
  };
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setEnviando(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo.trim(), contrasena }),
      });
      const result = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setError(result.error ?? "No se pudo iniciar sesión.");
        return;
      }

      if (result.usuario?.rol?.toUpperCase() !== "ADMIN") {
        setError("Esta cuenta no tiene acceso administrativo.");
        return;
      }

      const sessionResponse = await fetch("/api/auth/session", {
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!sessionResponse.ok) {
        setError("No se pudo establecer la sesión web. Verifica la configuración del sitio.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F0626] px-5 text-[#F6F1E7]">
      <section className="w-full max-w-md rounded-lg border border-[#3B2A6D] bg-[#1C0D42] p-7 shadow-2xl sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#FFD166]">
          PubliGana
        </p>
        <h1 className="mt-3 text-2xl font-bold">Acceso administrativo</h1>

        <form className="mt-7 space-y-5" onSubmit={iniciarSesion}>
          <div>
            <label className="mb-2 block text-sm text-[#C9C0DE]" htmlFor="correo">
              Correo electrónico
            </label>
            <input
              autoComplete="username"
              className="w-full rounded-md border border-[#514078] bg-[#0F0626] px-3 py-3 text-[#F6F1E7] outline-none focus:border-[#F5A623]"
              id="correo"
              name="correo"
              onChange={(event) => setCorreo(event.target.value)}
              required
              type="email"
              value={correo}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#C9C0DE]" htmlFor="contrasena">
              Contraseña
            </label>
            <input
              autoComplete="current-password"
              className="w-full rounded-md border border-[#514078] bg-[#0F0626] px-3 py-3 text-[#F6F1E7] outline-none focus:border-[#F5A623]"
              id="contrasena"
              name="contrasena"
              onChange={(event) => setContrasena(event.target.value)}
              required
              type="password"
              value={contrasena}
            />
          </div>

          {error && (
            <p aria-live="polite" className="text-sm text-[#FCA5A5]" role="alert">
              {error}
            </p>
          )}

          <button
            className="w-full rounded-md bg-[#F5A623] px-4 py-3 font-semibold text-[#0F0626] transition-colors hover:bg-[#FFD166] disabled:cursor-wait disabled:opacity-60"
            disabled={enviando}
            type="submit"
          >
            {enviando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </section>
    </main>
  );
}