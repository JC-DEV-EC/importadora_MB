export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  nombre: string;
  rol: string;
}

export interface AuthUser {
  token: string;
  email: string;
  nombre: string;
  rol: string;
}