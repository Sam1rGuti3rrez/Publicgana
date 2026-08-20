"use client";

import { useEffect, useState } from "react";

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  rol: string;
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("No hay una sesión activa.");
          return;
        }

        const response = await fetch("/api/usuarios/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "No autorizado.");
          return;
        }

        if (data.rol !== "ADMIN") {
          setError("No tienes permisos de administrador.");
          return;
        }

        setUsuario(data);
      } catch (error) {
        console.error(error);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    }

    cargarUsuario();
  }, []);

  if (cargando) {
    return (
      <main className="min-h-screen bg-[#0F0626] flex items-center justify-center">
        <p className="text-[#C4B5FD]">
          Cargando panel...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0F0626] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-[#EF4444]/40 bg-[#1C0D42] p-8 text-center">
          <h1 className="text-xl font-bold text-white">
            Acceso denegado
          </h1>

          <p className="mt-3 text-[#C4B5FD]">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F0626] text-white">

      {/* Barra superior */}
      <header className="border-b border-[#3B2A6D] bg-[#1C0D42]">
        <div className="flex items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7B2FBE]">
              <span className="font-bold">P</span>
            </div>

            <div>
              <h1 className="font-bold">
                Publigana
              </h1>

              <p className="text-xs text-[#9D86C8]">
                Panel administrativo
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-medium">
              {usuario?.nombres} {usuario?.apellidos}
            </p>

            <p className="text-xs text-[#F5A623]">
              {usuario?.rol}
            </p>
          </div>

        </div>
      </header>

      {/* Contenido */}
      <div className="p-6">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="mt-2 text-[#C4B5FD]">
            Bienvenido al centro de administración de Publigana.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-[#3B2A6D] bg-[#1C0D42] p-6">
            <p className="text-sm text-[#9D86C8]">
              Usuarios
            </p>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>
          </div>

          <div className="rounded-2xl border border-[#3B2A6D] bg-[#1C0D42] p-6">
            <p className="text-sm text-[#9D86C8]">
              Empresas
            </p>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>
          </div>

          <div className="rounded-2xl border border-[#3B2A6D] bg-[#1C0D42] p-6">
            <p className="text-sm text-[#9D86C8]">
              Campañas
            </p>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>
          </div>

          <div className="rounded-2xl border border-[#3B2A6D] bg-[#1C0D42] p-6">
            <p className="text-sm text-[#9D86C8]">
              Sorteos
            </p>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>
          </div>

        </div>

        {/* Información del administrador */}
        <div className="mt-8 rounded-2xl border border-[#3B2A6D] bg-[#1C0D42] p-6">
          <h3 className="text-xl font-semibold">
            Sesión actual
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <div>
              <p className="text-sm text-[#9D86C8]">
                Nombre
              </p>

              <p className="mt-1">
                {usuario?.nombres} {usuario?.apellidos}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#9D86C8]">
                Correo
              </p>

              <p className="mt-1">
                {usuario?.correo}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#9D86C8]">
                Teléfono
              </p>

              <p className="mt-1">
                {usuario?.telefono || "No registrado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#9D86C8]">
                Rol
              </p>

              <p className="mt-1 font-semibold text-[#F5A623]">
                {usuario?.rol}
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}