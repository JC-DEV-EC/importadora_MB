import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, LogOut, CheckCircle, AlertCircle, Info, AlertTriangle, X, Trash2, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../ui/Toast";
import { clientService } from "../../services/clientService";
import type { ClienteMbDto } from "../../types";

interface TopbarProps {
  onMenuClick: () => void;
}

const notifIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  error: <AlertCircle className="h-4 w-4 text-rose-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days} d`;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const { dark, toggle: toggleTheme } = useTheme();
  const { history, dismissToast, clearHistory } = useToast();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<ClienteMbDto[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [clock, setClock] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const term = searchValue.trim();
    if (!term) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await clientService.getAll(0, 5, term);
        setSuggestions(res.content);
        setShowSuggestions(true);
      } catch { setSuggestions([]); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchValue]);

  const handleSelect = (id: number) => {
    setShowSuggestions(false);
    setSearchValue("");
    navigate(`/clients/${id}`);
  };

  const handleSearchSubmit = () => {
    const term = searchValue.trim();
    setShowSuggestions(false);
    if (term) navigate(`/clients?q=${encodeURIComponent(term)}`);
    else navigate("/clients");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-default bg-card/80 px-3 backdrop-blur-xl sm:px-5">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-secondary transition-colors hover-bg lg:hidden shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden sm:block text-xs text-muted font-mono tabular-nums shrink-0">
        {clock}
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Buscar clientes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            className="w-full rounded-lg border border-default bg-surface py-2 pl-9 pr-3 text-sm text-primary placeholder-muted transition-colors focus:border-mb-400 focus:bg-card focus:outline-none focus:ring-2 focus:ring-mb-400/20"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full rounded-xl border border-default bg-card shadow-xl animate-scale-in overflow-hidden">
              {suggestions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover-bg border-b border-light last:border-b-0"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mb-100 text-xs font-semibold text-mb-700">
                    {c.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-primary truncate">{c.fullName}</p>
                    <p className="text-xs text-muted truncate">{c.city ?? "Sin ciudad"}</p>
                  </div>
                  <span className="text-xs font-mono text-secondary shrink-0">
                    {c.debt?.toFixed(2)} USD
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0" ref={notifRef}>
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-secondary transition-colors hover-bg"
          title={dark ? "Modo claro" : "Modo oscuro"}
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-lg p-2 text-secondary transition-colors hover-bg"
          >
            <Bell className="h-5 w-5" />
            {history.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[9px] font-bold text-white">
                {history.length > 9 ? "9+" : history.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-default bg-card shadow-xl animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between border-b border-light px-4 py-3">
                <p className="text-sm font-semibold text-primary">Notificaciones</p>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-xs text-muted hover:text-rose-500 flex items-center gap-1">
                    <Trash2 className="h-3 w-3" />
                    Limpiar
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-muted">
                    <Bell className="h-8 w-8 mb-2" />
                    <p className="text-sm">Sin notificaciones</p>
                  </div>
                ) : (
                  history.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { if (t.clienteId) { navigate(`/clients/${t.clienteId}`); setNotifOpen(false); } }}
                      className="flex w-full items-start gap-3 border-b border-light px-4 py-3 hover-bg group text-left"
                    >
                      <div className="mt-0.5 shrink-0">{notifIcons[t.type]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-primary">{t.message}</p>
                        <p className="text-[11px] text-muted mt-0.5">{timeAgo(t.timestamp)}</p>
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); dismissToast(t.id); }} className="text-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer">
                        <X className="h-3.5 w-3.5" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-mb-800 text-[10px] font-bold text-white shadow-sm">
            {user?.nombre?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-primary leading-tight">{user?.nombre ?? "Usuario"}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="rounded-lg p-2 text-muted transition-colors hover-bg hover:text-rose-600"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
