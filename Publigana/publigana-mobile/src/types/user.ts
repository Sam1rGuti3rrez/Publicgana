export type UserRole = "PROMOTOR" | "EMPRESA" | "ADMIN";

export type UserRank = "Básico" | "Pro" | "Premium" | "Elite";

export interface SocialNetwork {
  platform: "instagram" | "facebook" | "tiktok" | "youtube" | "twitter";
  username: string;
  followers: number;
  connected: boolean;
}

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: UserRole;
  rango: UserRank;
  saldo: number;
  publicacionesHoy: number;
  gananciasHoy: number;
  gananciasMes: number;
  redesSociales: SocialNetwork[];
  avatarUrl?: string;
}
