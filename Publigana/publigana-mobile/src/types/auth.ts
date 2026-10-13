export interface RegisterRequest {
  nombres?: string;
  apellidos?: string;
  nombreEmpresa?: string;
  nit?: string;
  correo: string;
  telefono: string;
  contrasena: string;
  rol: "promotor" | "negocio";
  countryCode: "CO";
  residencyConfirmed: true;
  municipalityCode: string;
  departmentCode: string;
  locality?: string;
}

export interface ColombianLocationCatalog {
  departments: ColombianDepartment[];
  municipalities: ColombianMunicipality[];
}

export interface ColombianDepartment {
  code: string;
  name: string;
}

export interface ColombianMunicipality {
  code: string;
  name: string;
  departmentCode: string;
  department: string;
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