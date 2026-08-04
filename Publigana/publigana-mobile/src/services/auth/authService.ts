import api from "../api";

import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from "@/types/auth";

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