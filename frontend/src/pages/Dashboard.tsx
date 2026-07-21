import { useEffect, useRef, useState } from "react";
import { useAllClients } from "../hooks/useClients";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Users, ArrowRight, Plus } from "lucide-react";
import { formatCurrency, getStatusLabel } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { animate, stagger } from "animejs";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#0f1f3a", "#cbd5e1"];

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1200 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    animate(obj, {
      val: value,
      duration,
      easing: "easeOutExpo",
      round: 1,
      onUpdate: () => { el.textContent = prefix + obj.val.toLocaleString("en-US") + suffix; },
    });
  }, [value, prefix, suffix, duration]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function Dashboard() {
  const { user } = useAuth();
  const { data: clients, isLoading } = useAllClients();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!clients || entered) return;
    setEntered(true);
    const cards = sectionRef.current?.querySelectorAll("[data-animate]");
    if (cards?.length) {
      animate(cards as NodeList, {
        translateY: [24, 0],
        opacity: [0, 1],
        duration: 500,
        delay: stagger(80),
        easing: "easeOutQuart",
      });
    }
  }, [clients, entered]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
      </div>
    );
  }

  const clientList = clients ?? [];
  const active = clientList.filter((c) => c.status === "ACTIVE");
  const cancelled = clientList.filter((c) => c.status === "CANCELLED");
  const withDiscount = clientList.filter((c) => c.discount);

  const stats = {
    total: clientList.length,
    active: active.length,
    cancelled: cancelled.length,
    debt: clientList.reduce((s, c) => s + c.debt, 0),
    payment: clientList.reduce((s, c) => s + c.payment, 0),
    outstanding: clientList.reduce((s, c) => s + c.totalAmount, 0),
  };

  const collectionRate = stats.debt > 0 ? (stats.payment / stats.debt) * 100 : 0;
  const activeRatio = stats.total > 0 ? (stats.active / stats.total) * 100 : 0;

  const recentClients = [...clientList]
    .sort((a, b) => {
      const da = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
      const db = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
      return db - da;
    })
    .slice(0, 5);

  const topDebtors = [...clientList]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  const barData = [
    { name: "Ene", deuda: 4200, pago: 2800 },
    { name: "Feb", deuda: 3800, pago: 2400 },
    { name: "Mar", deuda: 5100, pago: 3200 },
    { name: "Abr", deuda: 4600, pago: 2900 },
    { name: "May", deuda: 5400, pago: 3600 },
    { name: "Jun", deuda: 4900, pago: 3100 },
  ];

  const pieData = [
    { name: "Activos", value: stats.active },
    { name: "Cancelados", value: stats.cancelled },
  ];

  const initials = user?.nombre?.charAt(0).toUpperCase() ?? "U";

  return (
    <div ref={sectionRef} className="space-y-6 max-w-7xl mx-auto">
      <div data-animate className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mb-800 to-mb-900 text-base font-bold text-white shadow-md">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display text-primary">
                Hola, {user?.nombre?.split(" ")[0] ?? "Usuario"}
              </h1>
            </div>
            <p className="text-sm text-secondary mt-0.5">
              <AnimatedNumber value={stats.total} duration={1000} /> clientes &middot; {formatCurrency(stats.debt)} en cartera
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            <Users className="h-4 w-4" />
            Cartera
          </Button>
          <Button onClick={() => navigate("/clients/new")}>
            <Plus className="h-4 w-4" />
            Nuevo
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5">

        <div className="flex flex-col lg:flex-row gap-5">

          <div data-animate className="group relative flex items-center gap-5 overflow-hidden rounded-[20px] border border-default bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover shrink-0 lg:w-[220px] noise">
            <svg className="absolute top-2 right-2 opacity-[0.06] w-16 h-16" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
              <circle cx="22" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="38" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M16 38 Q22 32 30 38 T44 38" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
            <div className="relative shrink-0">
              <svg width="72" height="72" viewBox="0 0 36 36" className="drop-shadow-sm">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="color-mix(in srgb, var(--border) 80%, transparent)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--color-mb-600)" strokeWidth="3" strokeDasharray={`${activeRatio} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                <text x="18" y="19.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--text-primary)" fontFamily="Plus Jakarta Sans, sans-serif">{stats.total}</text>
              </svg>
            </div>
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Clientes</p>
              <div className="mt-2 flex items-center gap-2.5 text-xs">
                <span className="flex items-center gap-1 font-medium text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{stats.active}</span>
                <span className="text-muted">/</span>
                <span className="flex items-center gap-1 text-rose-400"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" />{stats.cancelled}</span>
              </div>
            </div>
          </div>

          <div data-animate className="group relative flex-1 overflow-hidden rounded-[20px] border border-default bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover noise">
            <div className="absolute inset-0 opacity-[0.018]" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 23px, var(--border) 23px, var(--border) 24px)`
            }} />
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, var(--color-accent-500) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
            <svg className="absolute bottom-3 right-4 opacity-[0.04] w-20 h-16" viewBox="0 0 80 60" fill="none">
              <rect x="6" y="8" width="16" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <rect x="8" y="12" width="12" height="4" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none" />
              <rect x="8" y="18" width="8" height="3" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none" />
              <path d="M28 30 L36 18 L44 24 L52 14 L60 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <circle cx="60" cy="22" r="2" fill="currentColor" />
            </svg>
            <div className="flex items-start justify-between relative">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
                  Deuda Total
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: "var(--badge-cancelled-bg)", color: "var(--badge-cancelled-text)" }}>
                    Cartera
                  </span>
                </p>
                <p className="mt-1 text-[34px] font-bold font-display tracking-tight text-primary">
                  <AnimatedNumber value={stats.debt} prefix="$" duration={1400} />
                </p>
                <p className="text-xs text-muted mt-0.5">
                  <span className="font-medium text-secondary">{withDiscount.length}</span> con descuento activo &middot; <span className="font-medium text-secondary">${(stats.debt / stats.total || 0).toFixed(0)}</span> promedio
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">

          <div data-animate className="group relative overflow-hidden rounded-[20px] p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover border border-default noise" style={{ background: "linear-gradient(135deg, var(--badge-active-bg) 0%, transparent 70%)" }}>
            <svg className="absolute top-3 right-4 w-20 h-16 opacity-[0.08]" viewBox="0 0 80 60" fill="none">
              <path d="M8 48 Q16 36 24 44 T40 24 T56 16 T72 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-600" fill="none" />
              <circle cx="72" cy="7" r="3" fill="currentColor" className="text-emerald-600" />
              <path d="M14 32 Q22 22 30 30 T46 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-emerald-400" fill="none" opacity="0.4" />
              <circle cx="72" cy="7" r="5" stroke="currentColor" className="text-emerald-600" strokeWidth="0.8" fill="none" opacity="0.3" />
            </svg>
            <svg className="absolute -bottom-1 -left-1 opacity-[0.04] w-24 h-20" viewBox="0 0 100 80" fill="none">
              <circle cx="50" cy="30" r="18" stroke="currentColor" strokeWidth="1.2" className="text-emerald-600" fill="none" />
              <path d="M50 20 L50 30 L56 36" stroke="currentColor" strokeWidth="1.5" className="text-emerald-600" strokeLinecap="round" fill="none" />
              <rect x="30" y="52" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
              <rect x="42" y="48" width="8" height="20" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
              <rect x="54" y="54" width="8" height="14" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
              <rect x="66" y="50" width="8" height="18" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
            <div className="flex items-center justify-between mb-4 relative">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full" style={{ color: "var(--badge-active-text)", backgroundColor: "color-mix(in srgb, var(--badge-active-text) 8%, transparent)" }}>
                  Cobrado
                </span>
              </div>
            </div>
            <p className="text-[30px] font-bold font-display tracking-tight leading-none relative" style={{ color: "var(--badge-active-text)" }}>
              <AnimatedNumber value={stats.payment} prefix="$" duration={1600} />
            </p>
            <div className="mt-5 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted">Tasa de cobro</span>
                <span className="text-sm font-bold font-mono" style={{ color: "var(--badge-active-text)" }}>{collectionRate.toFixed(0)}%</span>
              </div>
              <ProgressBar value={collectionRate} color="var(--badge-active-text)" />
            </div>
          </div>

          <div data-animate className="group relative overflow-hidden rounded-[20px] p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover border border-default noise" style={{ background: "linear-gradient(135deg, var(--badge-pending-bg) 0%, transparent 70%)" }}>
            <svg className="absolute -bottom-3 -right-3 w-28 h-28 opacity-[0.05] select-none pointer-events-none" viewBox="0 0 40 40" fill="none">
              <path d="M4 20 A16 16 0 0 1 36 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-amber-600" />
              <path d="M36 20 A16 16 0 0 1 4 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-amber-300" strokeDasharray="50 100" />
            </svg>
            <svg className="absolute top-3 right-3 opacity-[0.06] w-14 h-14" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="22" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M30 16 L30 30 L38 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.3" />
            </svg>
            <div className="flex items-center justify-between mb-4 relative">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full" style={{ color: "var(--badge-pending-text)", backgroundColor: "color-mix(in srgb, var(--badge-pending-text) 8%, transparent)" }}>
                  Pendiente
                </span>
              </div>
            </div>
            <p className="text-[30px] font-bold font-display tracking-tight leading-none relative" style={{ color: "var(--badge-pending-text)" }}>
              <AnimatedNumber value={stats.outstanding} prefix="$" duration={1800} />
            </p>
            <div className="mt-5 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted">Cartera pendiente</span>
                <span className="text-sm font-bold font-mono" style={{ color: "var(--badge-pending-text)" }}>{(100 - collectionRate).toFixed(0)}%</span>
              </div>
              <ProgressBar value={100 - collectionRate} color="var(--badge-pending-text)" />
              <p className="text-[11px] text-muted mt-1.5 text-right">Meta: &lt; 50%</p>
            </div>
          </div>
        </div>
      </div>

      <div data-animate className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-primary">Movimiento Mensual</h2>
            <div className="flex items-center gap-2.5 text-[11px] font-medium text-muted">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-mb-700" /> Deuda</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-accent-500" /> Cobrado</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", background: "var(--bg-card)", color: "var(--text-primary)" }} />
                <Bar dataKey="deuda" fill="var(--color-mb-700)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="pago" fill="var(--color-accent-500)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="text-base font-semibold text-primary mb-2">Estado de Cartera</h2>
          {stats.total === 0 ? (
            <div className="flex h-56 items-center justify-center text-muted text-sm">Sin datos</div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i]} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center gap-5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-mb-800" />
                  <span className="text-secondary">Activos ({stats.active})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="text-secondary">Cancelados ({stats.cancelled})</span>
                </div>
              </div>
              <div className="mt-4 grid w-full grid-cols-2 gap-2">
                <div className="rounded-xl p-3 text-center" style={{ background: "linear-gradient(135deg, var(--badge-active-bg), transparent)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--badge-active-text)" }}>Cobrado</p>
                  <p className="mt-1 text-lg font-bold" style={{ color: "var(--badge-active-text)" }}>{collectionRate.toFixed(1)}%</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "linear-gradient(135deg, var(--badge-pending-bg), transparent)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--badge-pending-text)" }}>Pendiente</p>
                  <p className="mt-1 text-lg font-bold" style={{ color: "var(--badge-pending-text)" }}>{(100 - collectionRate).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div data-animate className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-primary">Últimos Clientes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          {recentClients.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Sin clientes registrados</p>
          ) : (
            <div className="space-y-1">
              {recentClients.map((c) => (
                <button key={c.id} onClick={() => navigate(`/clients/${c.id}`)} className="flex w-full items-center gap-3 rounded-lg p-2.5 transition-all hover:bg-[var(--hover)] active:scale-[0.99]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold" style={{ backgroundColor: "var(--color-mb-100)", color: "var(--color-mb-700)" }}>
                    {c.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{c.fullName}</p>
                    <p className="text-xs text-muted">{c.city || "—"}</p>
                  </div>
                  <Badge variant={c.status === "ACTIVE" ? "active" : "cancelled"}>{getStatusLabel(c.status)}</Badge>
                  <span className="text-xs font-mono text-secondary shrink-0">{formatCurrency(c.totalAmount)}</span>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-primary mb-3">Mayores Deudores</h2>
          {topDebtors.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Sin deudores</p>
          ) : (
            <div className="space-y-1">
              {topDebtors.map((c, i) => (
                <button key={c.id} onClick={() => navigate(`/clients/${c.id}`)} className="flex w-full items-center gap-3 rounded-lg p-2.5 transition-all hover:bg-[var(--hover)] active:scale-[0.99]">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1"
                    style={{
                      backgroundColor: i === 0 ? "var(--badge-cancelled-bg)" : i === 1 ? "var(--badge-pending-bg)" : i === 2 ? "var(--badge-info-bg)" : "var(--badge-default-bg)",
                      color: i === 0 ? "var(--badge-cancelled-text)" : i === 1 ? "var(--badge-pending-text)" : i === 2 ? "var(--badge-info-text)" : "var(--badge-default-text)",
                      borderColor: i === 0 ? "color-mix(in srgb, var(--badge-cancelled-text) 30%, transparent)" : i === 1 ? "color-mix(in srgb, var(--badge-pending-text) 30%, transparent)" : i === 2 ? "color-mix(in srgb, var(--badge-info-text) 30%, transparent)" : "transparent",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{c.fullName}</p>
                    <p className="text-xs text-muted">{c.city || "—"}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold" style={{ color: "var(--badge-cancelled-text)" }}>{formatCurrency(c.totalAmount)}</span>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.width = "0%";
    animate({ w: 0 }, {
      w: Math.min(value, 100),
      duration: 1000,
      easing: "easeOutCubic",
      delay: 400,
      onUpdate: (self: any) => {
        el.style.width = `${self.animations[0].currentValue}%`;
      },
    });
  }, [value]);
  return (
    <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}>
      <div ref={barRef} className="h-full rounded-full" style={{ backgroundColor: color, width: "0%" }} />
    </div>
  );
}
