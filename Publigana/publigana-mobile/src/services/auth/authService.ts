import api from "../api";

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

export interface UserResponse {
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
  usuario: UserResponse;
}

class AuthService {
  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await api.post("/auth/register", data);

    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post("/auth/login", data);

    return response.data;
  }

  async me(): Promise<UserResponse> {
    const response = await api.get("/usuarios/me");

    return response.data;
  }
}

export default new AuthService();