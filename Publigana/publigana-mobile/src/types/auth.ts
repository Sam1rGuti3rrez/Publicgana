export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  contrasena: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  rol: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  usuario: User;
}