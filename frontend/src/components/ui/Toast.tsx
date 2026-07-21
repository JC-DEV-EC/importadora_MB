import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  clienteId?: number;
  timestamp: number;
}

const STORAGE_KEY = "mb_notifications";

function loadHistory(): Toast[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Toast[];
  } catch { return []; }
}

function saveHistory(items: Toast[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
  } catch { /* quota exceeded */ }
}

interface ToastContextValue {
  toasts: Toast[];
  history: Toast[];
  toast: (type: ToastType, message: string, clienteId?: number) => void;
  dismissToast: (id: number) => void;
  clearHistory: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 text-rose-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
};

const bgColors: Record<ToastType, string> = {
  success: "toast-success",
  error: "toast-error",
  info: "toast-info",
  warning: "toast-warning",
};

let nextId = Date.now();

function ToastItem({ t, onDismiss }: { t: Toast; onDismiss: (id: number) => void }) {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-slide-in-right",
        t.clienteId ? "cursor-pointer" : "",
        bgColors[t.type]
      )}
      onClick={() => { if (t.clienteId) { navigate(`/clients/${t.clienteId}`); onDismiss(t.id); } }}
    >
      {icons[t.type]}
      <p className="text-sm font-medium flex-1" style={{ color: `var(--toast-${t.type}-text)` }}>{t.message}</p>
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(t.id); }}
        className="hover:opacity-80" style={{ color: `var(--toast-${t.type}-text)` }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [history, setHistory] = useState<Toast[]>(loadHistory);

  useEffect(() => { saveHistory(history); }, [history]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const addToast = useCallback((type: ToastType, message: string, clienteId?: number) => {
    const toast: Toast = { id: nextId++, type, message, clienteId, timestamp: Date.now() };
    setToasts((prev) => [...prev, toast]);
    setHistory((prev) => [toast, ...prev]);
    setTimeout(() => dismissToast(toast.id), 5000);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, history, toast: addToast, dismissToast, clearHistory }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} t={t} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
