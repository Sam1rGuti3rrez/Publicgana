"use client";

import { useState, type ReactNode } from "react";
import { FiAward, FiBarChart2, FiBriefcase, FiChevronLeft, FiGrid, FiMenu, FiTarget, FiSettings, FiUsers } from "react-icons/fi";
import { LogoutButton } from "@/app/admin/logout-button";

const navigation = [
  { label: "Resumen", icon: FiGrid, active: true },
  { label: "Usuarios", icon: FiUsers, implemented: false },
  { label: "Empresas", icon: FiBriefcase, implemented: false },
  { label: "Campañas", icon: FiTarget, implemented: false },
  { label: "Sorteos", icon: FiAward, implemented: false },
  { label: "Reportes", icon: FiBarChart2, implemented: false },
  { label: "Configuración", icon: FiSettings, implemented: false },
];

export function DashboardShell({
  children,
  name,
  role,
  correo,
}: {
  children: ReactNode;
  name: string;
  role: string;
  correo: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? "lg:w-[84px]" : "lg:w-[288px]";
  const contentOffset = collapsed ? "lg:pl-[84px]" : "lg:pl-[288px]";

  return (
    <div className="min-h-screen bg-[#110a21] text-[#eaddfe]">
      {mobileOpen && (
        <button
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/55 lg:hidden"
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col justify-between bg-[#1f172f] shadow-2xl transition-[width,transform] duration-200 ${sidebarWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-[288px]`}
      >
        <div>
          <div className="flex h-16 items-center gap-3 px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7b2cbf] to-[#deb7ff] shadow-lg shadow-[#7b2cbf]/20">
              <span className="text-sm font-black text-white">P</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-[#eaddfe]">PubliGana</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#cfc2d5]">Console</div>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-1 px-4 py-2" aria-label="Navegación administrativa">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  aria-current={item.active ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-xl px-4 text-left text-sm transition-colors ${
                    item.active
                      ? "bg-[#7b2cbf] font-bold text-white shadow-md shadow-[#7b2cbf]/25"
                      : "text-[#cfc2d5] hover:bg-[#231b34] hover:text-[#eaddfe]"
                  } ${collapsed ? "lg:justify-center lg:px-2" : ""}`}
                  disabled={!item.active}
                  key={item.label}
                  title={item.implemented ? undefined : item.active ? undefined : "Módulo pendiente"}
                  type="button"
                >
                  <Icon className="h-[20px] w-[20px] shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <button
            className={`hidden h-10 items-center justify-between rounded-xl px-4 text-xs text-[#cfc2d5] hover:bg-[#231b34] hover:text-[#eaddfe] lg:flex ${collapsed ? "justify-center px-2" : ""}`}
            onClick={() => setCollapsed((value) => !value)}
            type="button"
          >
            <span className="flex items-center gap-2">
              <FiChevronLeft className={`h-[18px] w-[18px] transition-transform ${collapsed ? "rotate-180" : ""}`} />
              {!collapsed && <span>Colapsar menú</span>}
            </span>
            {!collapsed && <kbd className="rounded bg-[#39314a] px-1.5 py-0.5 text-[10px]">[</kbd>}
          </button>
          <LogoutButton className={collapsed ? "lg:justify-center lg:px-2" : ""} />
        </div>
      </aside>

      <div className={`min-w-0 transition-[padding] ${contentOffset}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#39314a]/70 bg-[#110a21]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Abrir menú"
              className="rounded-lg p-2 text-[#cfc2d5] hover:bg-[#231b34] lg:hidden"
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 text-sm text-[#988d9e] sm:flex">
              <span>Administración</span>
              <span>/</span>
              <span className="font-semibold text-[#eaddfe]">Resumen</span>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="truncate text-sm font-semibold text-[#eaddfe]">{name}</div>
              <div className="truncate text-xs text-[#deb7ff]">{role}</div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7b2cbf] text-xs font-bold text-white ring-2 ring-[#4c4353]">
              {name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <span className="sr-only">{correo}</span>
          </div>
        </header>
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
