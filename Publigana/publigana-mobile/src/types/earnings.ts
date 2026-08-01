export type EarningType = "publicacion" | "video" | "referido" | "bono";

export interface Earning {
  id: number;
  tipo: EarningType;
  descripcion: string;
  plataforma: string;
  monto: number;
  fecha: string;
}

export interface EarningsSummary {
  totalMes: number;
  totalSemana: number;
  totalHoy: number;
  crecimientoMes: number;
  historial: Earning[];
  barras: BarData[];
}

export interface BarData {
  dia: string;
  valor: number;
}
