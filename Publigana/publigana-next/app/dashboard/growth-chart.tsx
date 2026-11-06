"use client";

import { useMemo, useState } from "react";

type GrowthPoint = {
  label: string;
  total: number;
  promotores: number;
  negocios: number;
};

type GrowthFilter = "total" | "promotores" | "negocios";

export function GrowthChart({ data }: { data: GrowthPoint[] }) {
  const [filter, setFilter] = useState<GrowthFilter>("total");
  const values = data.map((point) => point[filter]);
  const maximum = Math.max(...values, 1);
  const width = 760;
  const height = 220;
  const left = 40;
  const right = 740;
  const top = 20;
  const bottom = 200;

  const points = useMemo(
    () =>
      values.map((value, index) => {
        const x = data.length === 1 ? left : left + (index * (right - left)) / (data.length - 1);
        const y = bottom - (value / maximum) * (bottom - top);
        return { x, y, value };
      }),
    [values, data.length, maximum, left, right, top, bottom],
  );

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${bottom} L ${points[0].x} ${bottom} Z`
    : "";

  const labels: Record<GrowthFilter, string> = {
    total: "Total",
    promotores: "Promotores",
    negocios: "Negocios",
  };

  return (
    <div>
      <div className="mb-4 flex w-full flex-wrap rounded-xl bg-[#231b34] p-1 sm:w-fit">
        {(Object.keys(labels) as GrowthFilter[]).map((key) => (
          <button
            className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
              filter === key
                ? "bg-[#7b2cbf] font-bold text-white shadow-sm"
                : "text-[#cfc2d5] hover:text-[#eaddfe]"
            }`}
            key={key}
            onClick={() => setFilter(key)}
            type="button"
          >
            {labels[key]}
          </button>
        ))}
      </div>

      <div className="relative w-full overflow-hidden">
        <svg aria-label={`Gráfico de crecimiento ${labels[filter].toLowerCase()}`} className="h-[220px] w-full" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="publiganaArea" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#deb7ff" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#7b2cbf" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="publiganaLine" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#8234c6" />
              <stop offset="100%" stopColor="#4edea3" />
            </linearGradient>
          </defs>
          {[20, 65, 110, 155, 200].map((y) => (
            <line key={y} stroke="#39314a" strokeDasharray="4 4" strokeOpacity="0.6" x1={left} x2={right} y1={y} y2={y} />
          ))}
          <path d={areaPath} fill="url(#publiganaArea)" />
          <path d={linePath} fill="none" stroke="url(#publiganaLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
          {points.map((point, index) => (
            <circle fill={index === points.length - 1 ? "#4edea3" : "#deb7ff"} key={`${data[index].label}-${point.value}`} r={index === points.length - 1 ? 6 : 4} cx={point.x} cy={point.y} />
          ))}
        </svg>
        <div className="flex justify-between px-4 pb-1 pl-12 text-[11px] text-[#cfc2d5]">
          {data.map((point, index) => (
            <span className={index === data.length - 1 ? "font-bold text-[#4edea3]" : ""} key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
