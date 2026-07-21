import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClient, useAddCharge, useAddPayment } from "../hooks/useClients";
import { useMovements } from "../hooks/useMovements";
import { Card, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import { formatCurrency, formatDate, getStatusLabel } from "../lib/utils";
import {
  ArrowLeft,
  Plus,
  DollarSign,
  Pencil,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { MovimientoMbDto } from "../types";

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = id ? Number(id) : null;
  const { data: client, isLoading } = useClient(clientId);
  const addCharge = useAddCharge();
  const addPayment = useAddPayment();
  const { toast } = useToast();
  const [movPage, setMovPage] = useState(0);
  const { data: movPageData } = useMovements(clientId, movPage, 10);

  const [chargeModal, setChargeModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeDesc, setChargeDesc] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDesc, setPaymentDesc] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-secondary">Cliente no encontrado</p>
        <Button variant="outline" onClick={() => navigate("/clients")}>Volver</Button>
      </div>
    );
  }

  const handleCharge = () => {
    const amount = parseFloat(chargeAmount);
    if (isNaN(amount) || amount <= 0) return;
    addCharge.mutate(
      { id: client.id, data: { amount, description: chargeDesc || undefined } },
      { onSuccess: () => { setChargeModal(false); setChargeAmount(""); setChargeDesc(""); setMovPage(0); toast("success", "Cargo registrado correctamente", client.id); }, onError: () => toast("error", "Error al registrar el cargo") }
    );
  };

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;
    addPayment.mutate(
      { id: client.id, data: { amount, description: paymentDesc || undefined } },
      { onSuccess: () => { setPaymentModal(false); setPaymentAmount(""); setPaymentDesc(""); setMovPage(0); toast("success", "Pago registrado correctamente", client.id); }, onError: () => toast("error", "Error al registrar el pago") }
    );
  };

  const movements = movPageData?.content ?? [];
  const movTotalPages = movPageData?.totalPages ?? 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mb-100 text-sm font-bold text-mb-700">
          {client.fullName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold font-display text-primary truncate">
            {client.fullName}
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted">
            {client.city && (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{client.city}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(client.registrationDate)}
            </span>
          </div>
        </div>
        <Badge variant={client.status === "ACTIVE" ? "active" : "cancelled"}>
          {getStatusLabel(client.status)}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Deuda Total</p>
          <p className="mt-1.5 text-2xl font-bold font-display text-primary">{formatCurrency(client.debt)}</p>
        </Card>
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Total Pagado</p>
          <p className="mt-1.5 text-2xl font-bold font-display text-emerald-600">{formatCurrency(client.payment)}</p>
        </Card>
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Saldo Pendiente</p>
          <p className="mt-1.5 text-2xl font-bold font-display text-primary">{formatCurrency(client.totalAmount)}</p>
        </Card>
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Descuento</p>
          <p className="mt-1.5 text-2xl font-bold font-display text-primary">
            {client.discount ? "10%" : "0%"}
          </p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setChargeModal(true)}>
          <Plus className="h-4 w-4" />
          Agregar Cargo
        </Button>
        <Button variant="secondary" onClick={() => setPaymentModal(true)}>
          <DollarSign className="h-4 w-4" />
          Registrar Pago
        </Button>
        <Button variant="outline" onClick={() => navigate(`/clients/${client.id}/edit`)}>
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-primary">Información del Cliente</h2>
          </CardHeader>
          <div className="space-y-3">
            {[
              ["Nombre completo", client.fullName],
              ["Ciudad", client.city ?? "—"],
              ["Registro", formatDate(client.registrationDate)],
              ["Descuento", client.discount ? "Sí (10%)" : "No"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-surface px-4 py-2.5">
                <span className="text-sm text-secondary">{label}</span>
                <span className="text-sm font-medium text-primary">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-primary">Resumen Financiero</h2>
          </CardHeader>
          <div className="space-y-3">
            {[
              ["Deuda total", formatCurrency(client.debt), "text-primary"],
              ["Total pagado", formatCurrency(client.payment), "text-emerald-600"],
              ...(client.discount ? [["Descuento aplicado", "10%", "text-amber-600"]] : []),
            ].map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-surface px-4 py-2.5">
                <span className="text-sm text-secondary">{label}</span>
                <span className={`text-sm font-mono font-medium ${color}`}>{value}</span>
              </div>
            ))}
            <div className="border-t border-default pt-3">
              <div className="flex items-center justify-between rounded-lg px-4 py-2.5" style={{ backgroundColor: "var(--color-mb-50)" }}>
                <span className="text-sm font-semibold text-mb-800">Saldo Final</span>
                <span className="text-sm font-mono font-bold text-mb-800">{formatCurrency(client.totalAmount)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-primary">Historial de Movimientos</h2>
        </CardHeader>
        {movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted">
              <DollarSign className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-medium text-secondary">Sin movimientos</p>
            <p className="text-xs text-muted">Los cargos y pagos aparecerán aquí</p>
          </div>
        ) : (
          <div className="divide-y border-light">
            {movements.map((m: MovimientoMbDto) => (
              <div key={m.id} className="flex items-center gap-4 px-4 py-3 hover-bg transition-colors">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  m.tipo === "CARGO" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                }`}>
                  {m.tipo === "CARGO" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary">
                    {m.tipo === "CARGO" ? "Cargo" : "Pago"}
                  </p>
                  <p className="text-xs text-muted">
                    {formatDate(m.fecha)}{m.descripcion ? ` · ${m.descripcion}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-mono font-medium ${
                    m.tipo === "CARGO" ? "text-rose-600" : "text-emerald-600"
                  }`}>
                    {m.tipo === "CARGO" ? "+" : "-"}{formatCurrency(m.monto)}
                  </p>
                  <p className="text-xs text-muted">Saldo: {formatCurrency(m.saldoResultante)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {movTotalPages > 1 && (
          <div className="flex items-center justify-between border-t border-default px-4 py-3">
            <p className="text-xs text-muted">Página {movPage + 1} de {movTotalPages}</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={movPage === 0} onClick={() => setMovPage(movPage - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled={movPage >= movTotalPages - 1} onClick={() => setMovPage(movPage + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal open={chargeModal} onClose={() => setChargeModal(false)} title="Agregar Cargo">
        <div className="space-y-4">
          <Input
            label="Monto del cargo"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={chargeAmount}
            onChange={(e) => setChargeAmount(e.target.value)}
          />
          <Input
            label="Descripción (opcional)"
            placeholder="Ej: Nueva factura"
            value={chargeDesc}
            onChange={(e) => setChargeDesc(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setChargeModal(false)}>Cancelar</Button>
            <Button onClick={handleCharge} isLoading={addCharge.isPending} disabled={!chargeAmount || parseFloat(chargeAmount) <= 0}>
              Agregar Cargo
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={paymentModal} onClose={() => setPaymentModal(false)} title="Registrar Pago">
        <div className="space-y-4">
          <Input
            label="Monto del pago"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
          <Input
            label="Descripción (opcional)"
            placeholder="Ej: Pago en efectivo"
            value={paymentDesc}
            onChange={(e) => setPaymentDesc(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setPaymentModal(false)}>Cancelar</Button>
            <Button onClick={handlePayment} isLoading={addPayment.isPending} disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}>
              Registrar Pago
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
