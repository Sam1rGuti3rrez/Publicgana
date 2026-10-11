export interface RegisterRequest {
  nombres?: string;
  apellidos?: string;
  nombreEmpresa?: string;
  nit?: string;
  correo: string;
  telefono: string;
  contrasena: string;
  rol: "promotor" | "negocio";
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface UserResponse {
  id: string;
  nombres?: string;
  apellidos?: string;
  correo: string;
  telefono?: string;
  rol: AuthenticatedUserRole;
}
export type AuthenticatedUserRole = "ADMIN" | "PROMOTOR" | "NEGOCIO";

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  usuario: UserResponse;
}