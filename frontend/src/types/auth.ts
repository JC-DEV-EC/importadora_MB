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

export interface UsuarioDto {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  estado: string;
  createdAt: string | null;
}

export interface AuthUser {
  token: string;
  email: string;
  nombre: string;
  rol: string;
}