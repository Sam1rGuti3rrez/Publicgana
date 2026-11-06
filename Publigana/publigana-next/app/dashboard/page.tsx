import { requireAdminPage } from "@/app/lib/admin-page-auth";
import { getPrisma } from "@/app/lib/prisma";
import { DashboardShell } from "./dashboard-shell";
import { FiAward, FiBriefcase, FiTarget, FiUsers, FiUserPlus, FiMoreVertical } from "react-icons/fi";
import { GrowthChart } from "./growth-chart";

export default async function DashboardPage() {
  const usuario = await requireAdminPage();
  const nombre = [usuario.nombres, usuario.apellidos].filter(Boolean).join(" ");
  const prisma = getPrisma();
  const [usuarios, empresas, campanas, sorteos, recientes, ultimasCampanas] = await Promise.all([
    prisma.usuario.count(),
    prisma.empresa.count(),
    prisma.campania.count(),
    prisma.sorteo.count(),
    prisma.usuario.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, nombres: true, apellidos: true, correo: true, activo: true, rol: { select: { nombre: true } } },
    }),
    prisma.campania.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        titulo: true,
        activa: true,
        fechaFin: true,
        creador: { select: { nombres: true, apellidos: true, empresas: { take: 1, select: { nombre: true } } } },
        _count: { select: { participaciones: true } },
      },
    }),
  ]);

  const ahora = new Date();
  const activeCampaigns = await prisma.campania.count({ where: { activa: true, fechaFin: { gte: ahora } } });
  const endingCampaigns = await prisma.campania.count({ where: { activa: true, fechaFin: { gte: ahora, lte: new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000) } } });
  const finishedCampaigns = await prisma.campania.count({ where: { fechaFin: { lt: ahora } } });
  const inactiveCampaigns = Math.max(0, campanas - activeCampaigns - finishedCampaigns);

  const allUsersForGrowth = await prisma.usuario.findMany({
    select: { createdAt: true, rol: { select: { nombre: true } } },
    orderBy: { createdAt: "asc" },
  });

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(ahora.getFullYear(), ahora.getMonth() - 5 + index, 1);
    return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleDateString("es-CO", { month: "short" }), date };
  });
  const growthData = months.map((month) => {
    const monthEnd = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0, 23, 59, 59);
    const visible = allUsersForGrowth.filter((item) => item.createdAt <= monthEnd);
    return {
      label: month.label,
      total: visible.length,
      promotores: visible.filter((item) => item.rol.nombre.toUpperCase() === "PROMOTOR").length,
      negocios: visible.filter((item) => item.rol.nombre.toUpperCase() === "NEGOCIO").length,
    };
  });

  const fmt = new Intl.NumberFormat("es-CO");
  const campaignDistribution = [
    { label: "Activas", count: activeCampaigns, color: "#4edea3", bg: "rgba(78,222,163,.22)" },
    { label: "Finalizadas", count: finishedCampaigns, color: "#deb7ff", bg: "rgba(222,183,255,.18)" },
    { label: "Inactivas", count: inactiveCampaigns, color: "#988d9e", bg: "rgba(152,141,158,.18)" },
  ];
  const distributionTotal = campaignDistribution.reduce((sum, item) => sum + item.count, 0);

  const statCards = [
    { label: "Usuarios registrados", value: fmt.format(usuarios), icon: FiUsers, glow: "#deb7ff", iconBg: "bg-[#7b2cbf]/20 text-[#deb7ff]", footer: `${fmt.format(recientes.length)} registros recientes` },
    { label: "Empresas asociadas", value: fmt.format(empresas), icon: FiBriefcase, glow: "#ddb7ff", iconBg: "bg-[#6f00be]/30 text-[#f0dbff]", footer: `${empresas} empresas registradas` },
    { label: "Campañas activas", value: fmt.format(activeCampaigns), icon: FiTarget, glow: "#4edea3", iconBg: "bg-[#006544] text-[#58e7ab]", footer: `${fmt.format(endingCampaigns)} finalizan en 7 días` },
    { label: "Sorteos ejecutados", value: fmt.format(sorteos), icon: FiAward, glow: "#deb7ff", iconBg: "bg-[#7b2cbf] text-[#e4c2ff]", footer: "Datos registrados en plataforma" },
  ];

  return (
    <DashboardShell name={nombre} role={usuario.rol.nombre} correo={usuario.correo}>
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 sm:p-6 lg:p-9">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-[#eaddfe] sm:text-[30px]">Panel de Control General</h1>
              <span className="inline-flex items-center rounded-full bg-[#006544]/30 px-2 py-1 text-[10px] font-bold text-[#4edea3]">
                <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-[#4edea3]" /> Sistema en línea
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-[#cfc2d5]">Bienvenido de nuevo, Administrador. Vista consolidada de métricas y actividad operativa.</p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Estadísticas principales">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="group relative flex min-h-[145px] flex-col justify-between overflow-hidden rounded-xl bg-[#1f172f] p-6 shadow-lg transition-colors hover:bg-[#231b34]" key={card.label}>
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl transition-colors" style={{ background: `${card.glow}12` }} />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#cfc2d5]">{card.label}</p>
                    <p className="mt-1 text-4xl font-bold tracking-tight text-[#eaddfe]">{card.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-105 ${card.iconBg}`}><Icon className="h-6 w-6" /></div>
                </div>
                <div className="mt-4 border-t border-[#4c4353]/25 pt-3 text-xs text-[#cfc2d5]">{card.footer}</div>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <article className="rounded-xl bg-[#1f172f] p-5 shadow-xl sm:p-6 lg:col-span-8">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-[#eaddfe]">Evolución de crecimiento de usuarios</h2>
                <p className="mt-1 text-xs text-[#cfc2d5]">Total acumulado por mes, calculado desde el registro real</p>
              </div>
            </div>
            <GrowthChart data={growthData} />
          </article>

          <article className="rounded-xl bg-[#1f172f] p-5 shadow-xl sm:p-6 lg:col-span-4">
            <div className="flex items-start justify-between border-b border-[#4c4353]/20 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-[#eaddfe]">Distribución de campañas</h2>
                <p className="mt-1 text-xs text-[#cfc2d5]">Estado actual calculado</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{fmt.format(distributionTotal)}</div>
                <div className="text-[10px] text-[#cfc2d5]">Totales</div>
              </div>
            </div>
            <div className="my-5 flex h-3.5 overflow-hidden rounded-full bg-[#39314a]">
              {campaignDistribution.map((item) => (
                <div key={item.label} style={{ width: `${distributionTotal ? (item.count / distributionTotal) * 100 : 0}%`, backgroundColor: item.color }} title={`${item.label}: ${item.count}`} />
              ))}
            </div>
            <div className="space-y-2">
              {campaignDistribution.map((item) => (
                <div className="flex items-center justify-between rounded-lg bg-[#231b34]/60 p-2" key={item.label}>
                  <div className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</div>
                  <div className="flex gap-3 text-xs"><span className="font-bold" style={{ color: item.color }}>{distributionTotal ? Math.round((item.count / distributionTotal) * 100) : 0}%</span><span className="w-8 text-right text-[#cfc2d5]">{fmt.format(item.count)}</span></div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <article className="rounded-xl bg-[#1f172f] p-5 shadow-xl sm:p-6 lg:col-span-7">
            <div className="mb-4 flex items-center justify-between border-b border-[#4c4353]/20 pb-4">
              <div className="flex items-center gap-2"><FiTarget className="h-5 w-5 text-[#deb7ff]" /><h2 className="text-lg font-semibold">Últimas campañas creadas</h2></div>
            </div>
            {ultimasCampanas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#4c4353] py-10 text-center text-sm text-[#cfc2d5]">No hay campañas registradas</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="text-[10px] uppercase text-[#cfc2d5]"><tr className="bg-[#231b34]/60"><th className="rounded-l-lg px-3 py-2">Campaña</th><th className="px-3 py-2">Empresa / creador</th><th className="px-3 py-2 text-right">Participantes</th><th className="px-3 py-2 text-center">Estado</th><th className="rounded-r-lg px-3 py-2 text-right">Acción</th></tr></thead>
                  <tbody className="divide-y divide-[#4c4353]/10">
                    {ultimasCampanas.map((campaign) => {
                      const company = campaign.creador.empresas[0]?.nombre;
                      const creator = [campaign.creador.nombres, campaign.creador.apellidos].filter(Boolean).join(" ");
                      const active = campaign.activa && campaign.fechaFin >= ahora;
                      return (
                        <tr className="transition-colors hover:bg-[#231b34]/60" key={campaign.id}>
                          <td className="px-3 py-3"><div className="font-medium">{campaign.titulo}</div><div className="mt-1 text-[10px] text-[#988d9e]">ID: {campaign.id.slice(0, 8)}</div></td>
                          <td className="px-3 py-3 text-[#cfc2d5]">{company || creator || "Sin asignar"}</td>
                          <td className="px-3 py-3 text-right">{fmt.format(campaign._count.participaciones)}</td>
                          <td className="px-3 py-3 text-center"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${active ? "bg-[#006544]/30 text-[#4edea3]" : "bg-[#39314a] text-[#cfc2d5]"}`}>{active ? "Activa" : campaign.fechaFin < ahora ? "Finalizada" : "Inactiva"}</span></td>
                          <td className="px-3 py-3 text-right"><button aria-label={`Acciones de ${campaign.titulo}`} className="rounded-lg p-1.5 text-[#cfc2d5] hover:bg-[#39314a]" type="button"><FiMoreVertical /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className="rounded-xl bg-[#1f172f] p-5 shadow-xl sm:p-6 lg:col-span-5">
            <div className="mb-3 flex items-center justify-between border-b border-[#4c4353]/20 pb-4">
              <div className="flex items-center gap-2"><FiUserPlus className="h-5 w-5 text-[#deb7ff]" /><h2 className="text-lg font-semibold">Nuevos registros</h2></div>
              <span className="text-xs text-[#988d9e]">Recientes</span>
            </div>
            <div className="space-y-1">
              {recientes.map((recent) => {
                const recentName = [recent.nombres, recent.apellidos].filter(Boolean).join(" ");
                const initials = recentName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
                const role = recent.rol.nombre.toUpperCase();
                return (
                  <div className="flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-[#231b34]" key={recent.id}>
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7b2cbf]/60 text-xs font-bold">{initials}</div>
                      <div className="min-w-0"><div className="truncate text-sm font-medium">{recentName}</div><div className="truncate text-xs text-[#988d9e]">{recent.correo}</div></div>
                    </div>
                    <span className={`shrink-0 rounded px-2 py-1 text-[10px] font-bold ${role === "NEGOCIO" ? "bg-[#006544]/30 text-[#4edea3]" : role === "ADMIN" ? "bg-[#7b2cbf] text-white" : "bg-[#6f00be]/40 text-[#f0dbff]"}`}>{role}</span>
                  </div>
                );
              })}
              {recientes.length === 0 && <div className="py-8 text-center text-sm text-[#cfc2d5]">No hay usuarios registrados</div>}
            </div>
          </article>
        </section>
      </div>
    </DashboardShell>
  );
}