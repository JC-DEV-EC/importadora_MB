import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Sun, Moon } from "lucide-react";

export function Login() {
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--bg-layout)" }}>
      <button
        onClick={toggle}
        className="fixed top-4 right-4 rounded-lg p-2 text-muted transition-colors hover-bg"
        title={dark ? "Modo claro" : "Modo oscuro"}
      >
        {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mb-800 to-mb-900 text-lg font-extrabold text-white shadow-lg">
            MB
          </div>
          <h1 className="text-2xl font-bold  text-primary">Importadora MB</h1>
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
          &copy; 2026 Importadora MB. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
