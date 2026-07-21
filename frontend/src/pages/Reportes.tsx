import { useMemo } from "react";
import { useAllClients } from "../hooks/useClients";
import { Card } from "../components/ui/Card";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-default bg-card p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted">{label}</p>
          <p className="mt-0.5 text-xl font-bold text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
}

const barData = [
  { name: "Ene", deuda: 4200, pago: 2800 },
  { name: "Feb", deuda: 3800, pago: 2400 },
  { name: "Mar", deuda: 5100, pago: 3200 },
  { name: "Abr", deuda: 4600, pago: 2900 },
  { name: "May", deuda: 5400, pago: 3600 },
  { name: "Jun", deuda: 4900, pago: 3100 },
];

export function Reportes() {
  const { data: clients, isLoading } = useAllClients();

  const stats = useMemo(() => {
    const list = clients ?? [];
    const active = list.filter((c) => c.status === "ACTIVE");
    const deudaTotal = list.reduce((s, c) => s + c.debt, 0);
    const cobradoTotal = list.reduce((s, c) => s + c.payment, 0);
    return {
      totalClientes: list.length,
      clientesActivos: active.length,
      deudaTotal,
      cobradoTotal,
      pendienteTotal: list.reduce((s, c) => s + c.totalAmount, 0),
      efectividad: deudaTotal > 0 ? ((cobradoTotal / deudaTotal) * 100).toFixed(0) + "%" : "0%",
    };
  }, [clients]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Reportes</h1>
        <p className="mt-1 text-sm text-secondary">Estadísticas generales del sistema</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} label="Total Clientes" value={stats.totalClientes} />
        <StatCard icon={Users} label="Clientes Activos" value={stats.clientesActivos} />
        <StatCard icon={DollarSign} label="Deuda Total" value={formatCurrency(stats.deudaTotal)} />
        <StatCard icon={DollarSign} label="Cobrado Total" value={formatCurrency(stats.cobradoTotal)} />
        <StatCard icon={TrendingUp} label="Saldo Pendiente" value={formatCurrency(stats.pendienteTotal)} />
        <StatCard icon={TrendingUp} label="Efectividad" value={stats.efectividad} />
      </div>

      <Card>
        <h2 className="text-base font-semibold text-primary mb-4">Movimiento Mensual</h2>
        <div className="flex items-center gap-3 text-xs text-muted mb-4">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-mb-600" /> Deuda</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Cobrado</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }} />
              <Bar dataKey="deuda" fill="var(--color-mb-600)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="pago" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
