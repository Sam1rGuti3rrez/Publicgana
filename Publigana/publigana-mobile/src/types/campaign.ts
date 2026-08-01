export type CampaignStatus = "ACTIVA" | "PAUSADA" | "BORRADOR" | "FINALIZADA";

export type SocialPlatform = "instagram" | "facebook" | "tiktok" | "youtube" | "twitter";

export interface Campaign {
  id: number;
  titulo: string;
  empresa: string;
  descripcion: string;
  plataforma: SocialPlatform;
  recompensa: number;
  estado: CampaignStatus;
  participantes: number;
  cupoMaximo: number;
  fechaFin: string;
  imagenUrl?: string;
  categoria?: string;
}

export type CampaignFilter = "todas" | "activas" | "instagram" | "facebook" | "tiktok";
