import { LogoutButton } from "@/app/admin/logout-button";
import { requireAdminPage } from "@/app/lib/admin-page-auth";

export default async function DashboardPage() {
  const usuario = await requireAdminPage();
  const nombre = [usuario.nombres, usuario.apellidos].filter(Boolean).join(" ");

  return (
    <main className="min-h-screen bg-[#0F0626] text-white">
      <header className="border-b border-[#3B2A6D] bg-[#1C0D42]">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7B2FBE]">
              <span className="font-bold">P</span>
            </div>
            <div>
              <h1 className="font-bold">Publigana</h1>
              <p className="text-xs text-[#9D86C8]">Panel administrativo</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="font-medium">{nombre}</p>
              <p className="text-xs text-[#F5A623]">{usuario.rol.nombre}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="mt-2 text-[#C9C0DE]">
            Bienvenido al centro de administración de Publigana.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {["Usuarios", "Empresas", "Campañas", "Sorteos"].map((label) => (
            <div
              className="rounded-lg border border-[#3B2A6D] bg-[#1C0D42] p-6"
              key={label}
            >
              <p className="text-sm text-[#9D86C8]">{label}</p>
              <p className="mt-3 text-3xl font-bold">—</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-lg border border-[#3B2A6D] bg-[#1C0D42] p-6">
          <h3 className="text-xl font-semibold">Sesión actual</h3>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm text-[#9D86C8]">Nombre</dt>
              <dd className="mt-1">{nombre}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#9D86C8]">Correo</dt>
              <dd className="mt-1">{usuario.correo}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#9D86C8]">Teléfono</dt>
              <dd className="mt-1">{usuario.telefono || "No registrado"}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#9D86C8]">Rol</dt>
              <dd className="mt-1 font-semibold text-[#F5A623]">
                {usuario.rol.nombre}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}