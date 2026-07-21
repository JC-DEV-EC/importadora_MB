import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthUser, LoginRequest } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("mb_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await authService.login(data);
    const authUser: AuthUser = {
      token: res.token,
      email: res.email,
      nombre: res.nombre,
      rol: res.rol,
    };
    localStorage.setItem("mb_user", JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("mb_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin: user?.rol === "ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}