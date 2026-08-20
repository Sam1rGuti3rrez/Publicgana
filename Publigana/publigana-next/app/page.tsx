"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

export default function Home() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          contrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No fue posible iniciar sesión.");
        return;
      }

      console.log("Login exitoso:", data);

      // Guardamos el token temporalmente.
      localStorage.setItem("accessToken", data.accessToken);

      alert(`Bienvenido, ${data.usuario.nombres}`);
    } catch (error) {
      console.error("Error de conexión:", error);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F0626] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-[#1C0D42] border border-[#3B2A6D] rounded-3xl shadow-2xl p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#261455] border border-[#3B2A6D] shadow-lg overflow-hidden">
              <Image
                src="/logo.jpg"
                alt="Logo de Publigana"
                width={90}
                height={90}
                priority
                className="h-auto w-auto max-h-20 max-w-20 object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Publigana
            </h1>

            <p className="mt-2 text-sm text-[#C4B5FD]">
              Panel de administración
            </p>

            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#F5A623]" />
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Correo */}
            <div>
              <label
                htmlFor="correo"
                className="mb-2 block text-sm font-medium text-white"
              >
                Correo electrónico
              </label>

              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="admin@publigana.com"
                required
                disabled={cargando}
                className="w-full rounded-xl border border-[#3B2A6D] bg-[#22104A] px-4 py-3 text-white placeholder-[#A1A1AA] outline-none transition focus:border-[#A855F7] focus:ring-2 focus:ring-[#7B2FBE]/30 disabled:opacity-50"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="contrasena"
                className="mb-2 block text-sm font-medium text-white"
              >
                Contraseña
              </label>

              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                required
                disabled={cargando}
                className="w-full rounded-xl border border-[#3B2A6D] bg-[#22104A] px-4 py-3 text-white placeholder-[#A1A1AA] outline-none transition focus:border-[#A855F7] focus:ring-2 focus:ring-[#7B2FBE]/30 disabled:opacity-50"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-xl bg-[#7B2FBE] px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-[#A855F7] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#9D86C8]">
            Publigana · Panel administrativo
          </p>
        </div>
      </div>
    </main>
  );
}