import { useMemo } from "react";
import { useAllClients } from "../hooks/useClients";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Users, ArrowRight, Plus } from "lucide-react";
import { formatCurrency, getStatusLabel } from "../lib/utils";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const barData = [
  { name: "Ene", deuda: 4200, pago: 2800 },
  { name: "Feb", deuda: 3800, pago: 2400 },
  { name: "Mar", deuda: 5100, pago: 3200 },
  { name: "Abr", deuda: 4600, pago: 2900 },
  { name: "May", deuda: 5400, pago: 3600 },
  { name: "Jun", deuda: 4900, pago: 3100 },
];

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-default bg-card p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
      {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: clients, isLoading } = useAllClients();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const list = clients ?? [];
    const active = list.filter((c) => c.status === "ACTIVE");
    const cancelled = list.filter((c) => c.status === "CANCELLED");
    const withDiscount = list.filter((c) => c.discount);
    const debt = list.reduce((s, c) => s + c.debt, 0);
    const payment = list.reduce((s, c) => s + c.payment, 0);
    const outstanding = list.reduce((s, c) => s + c.totalAmount, 0);
    return {
      total: list.length,
      active: active.length,
      cancelled: cancelled.length,
      debt,
      payment,
      outstanding,
      collectionRate: debt > 0 ? (payment / debt) * 100 : 0,
      withDiscount: withDiscount.length,
    };
  }, [clients]);

  const recentClients = useMemo(() =>
    [...(clients ?? [])]
      .sort((a, b) => {
        const da = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
        const db = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
        return db - da;
      })
      .slice(0, 5),
  [clients]);

  const topDebtors = useMemo(() =>
    [...(clients ?? [])]
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5),
  [clients]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">
            Hola, {user?.nombre?.split(" ")[0] ?? "Usuario"}
          </h1>
          <p className="text-sm text-secondary mt-0.5">
            {stats.total} clientes &middot; {formatCurrency(stats.debt)} en cartera
          </p>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total clientes" value={String(stats.total)} sub={`${stats.active} activos · ${stats.cancelled} cancelados`} />
        <StatCard label="Deuda total" value={formatCurrency(stats.debt)} />
        <StatCard label="Cobrado" value={formatCurrency(stats.payment)} sub={`${stats.collectionRate.toFixed(0)}% tasa de cobro`} />
        <StatCard label="Saldo pendiente" value={formatCurrency(stats.outstanding)} sub={`${stats.withDiscount} con descuento`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <h2 className="text-sm font-semibold text-primary mb-4">Movimiento Mensual</h2>
          <div className="flex items-center gap-3 text-xs text-muted mb-4">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-mb-700" /> Deuda</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-accent-500" /> Cobrado</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }} />
                <Bar dataKey="deuda" fill="var(--color-mb-700)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="pago" fill="var(--color-accent-500)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="text-sm font-semibold text-primary mb-4">Resumen</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
              <span className="text-sm text-secondary">Activos</span>
              <span className="text-sm font-semibold text-primary">{stats.active}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
              <span className="text-sm text-secondary">Cancelados</span>
              <span className="text-sm font-semibold text-primary">{stats.cancelled}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
              <span className="text-sm text-secondary">Cobrado</span>
              <span className="text-sm font-semibold text-emerald-600">{stats.collectionRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
              <span className="text-sm text-secondary">Pendiente</span>
              <span className="text-sm font-semibold text-amber-600">{(100 - stats.collectionRate).toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-primary">Últimos Clientes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          {recentClients.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Sin clientes registrados</p>
          ) : (
            <div className="space-y-1">
              {recentClients.map((c) => (
                <button key={c.id} onClick={() => navigate(`/clients/${c.id}`)} className="flex w-full items-center gap-3 rounded-lg p-2.5 hover:bg-[var(--hover)] transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-secondary">
                    {c.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{c.fullName}</p>
                    <p className="text-xs text-muted">{c.city || "—"}</p>
                  </div>
                  <div className="w-24 text-center">
                    <Badge>{getStatusLabel(c.status)}</Badge>
                  </div>
                  <span className="w-24 text-right text-xs font-mono text-secondary shrink-0">{formatCurrency(c.totalAmount)}</span>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-primary mb-3">Mayores Deudores</h2>
          {topDebtors.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Sin deudores</p>
          ) : (
            <div className="space-y-1">
              {topDebtors.map((c, i) => (
                <button key={c.id} onClick={() => navigate(`/clients/${c.id}`)} className="flex w-full items-center gap-3 rounded-lg p-2.5 hover:bg-[var(--hover)] transition-colors">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-muted">
                    {i + 1}
                  </span>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{c.fullName}</p>
                    <p className="text-xs text-muted">{c.city || "—"}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-rose-600">{formatCurrency(c.totalAmount)}</span>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
