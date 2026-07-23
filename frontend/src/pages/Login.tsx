import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { configuracionService } from "../services/configuracionService";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: nombreEmpresa } = useQuery({
    queryKey: ["config", "nombre_empresa"],
    queryFn: () => configuracionService.getByClave("nombre_empresa"),
    staleTime: 5 * 60 * 1000,
  });

  const empresa = nombreEmpresa?.valor ?? "Importadora MB";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--bg-body)" }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="MB" className="mx-auto mb-4 h-24 w-24 rounded-2xl object-cover shadow-card" />
          <h1 className="text-2xl font-bold  text-primary">{empresa}</h1>
          <p className="mt-1 text-sm text-secondary">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-default bg-card p-6 shadow-sm space-y-4">
          {error && (
            <div className="rounded-lg px-4 py-2.5 text-sm font-medium" style={{ backgroundColor: "var(--badge-cancelled-bg)", color: "var(--badge-cancelled-text)" }}>
              {error}
            </div>
          )}
          <Input label="Email" type="email" placeholder="admin@importadoramb.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Contraseña" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" isLoading={loading}>
            Iniciar Sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          &copy; 2026 {empresa}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
