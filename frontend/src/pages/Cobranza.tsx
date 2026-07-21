import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { DataTable, type Column } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Search, X, ChevronLeft, ChevronRight, DollarSign, Phone, Mail, Users } from "lucide-react";
import { formatCurrency } from "../lib/utils";

interface ClienteCobranzaDto {
  id: number;
  fullName: string;
  city: string | null;
  telefono: string | null;
  email: string | null;
  debt: number;
  payment: number;
  totalAmount: number;
  status: string;
}

const cobranzaService = {
  getAll: (page: number, size: number, q?: string) =>
    api.get("/clients", { params: { page, size, q, status: "ACTIVE" } }).then((r) => r.data),
};

export function Cobranza() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState<ClienteCobranzaDto[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const size = 15;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await cobranzaService.getAll(page, size, q || undefined);
      const items = (res.content ?? []).filter((c: ClienteCobranzaDto) => c.totalAmount > 0);
      setData(items);
      setTotalPages(res.totalPages ?? 0);
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, q]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQ(searchInput.trim());
      setPage(0);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  const stats = {
    totalMorosos: data.length,
    deudaTotal: data.reduce((s, c) => s + c.debt, 0),
    cobradoTotal: data.reduce((s, c) => s + c.payment, 0),
  };

  const columns: Column<ClienteCobranzaDto>[] = [
    {
      key: "fullName",
      header: "Nombre",
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
            {c.fullName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-primary">{c.fullName}</p>
            {c.email && <p className="text-xs text-gray-500">{c.email}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "city",
      header: "Ciudad",
      render: (c) => <span className="text-gray-500 text-sm">{c.city || "—"}</span>,
      hideOnMobile: true,
    },
    {
      key: "telefono",
      header: "Teléfono",
      render: (c) => <span className="text-gray-500 text-sm">{c.telefono || "—"}</span>,
      hideOnMobile: true,
    },
    {
      key: "debt",
      header: "Deuda",
      render: (c) => <span className="font-mono text-sm font-medium text-gray-900">{formatCurrency(c.debt)}</span>,
      className: "text-right",
    },
    {
      key: "payment",
      header: "Pagado",
      render: (c) => <span className="font-mono text-sm text-emerald-600">{formatCurrency(c.payment)}</span>,
      className: "text-right hidden lg:table-cell",
      hideOnMobile: true,
    },
    {
      key: "totalAmount",
      header: "Saldo",
      render: (c) => (
        <span className="font-mono text-sm font-medium text-red-600">{formatCurrency(c.totalAmount)}</span>
      ),
      className: "text-right",
    },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => navigate(`/clients/${c.id}`)} className="rounded p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50" title="Pagar">
            <DollarSign className="h-4 w-4" />
          </button>
          <button onClick={() => window.open(`https://wa.me/${(c.telefono ?? "").replace(/\D/g, "")}`, "_blank")} className="rounded p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50" title="WhatsApp">
            <Phone className="h-4 w-4" />
          </button>
          <button onClick={() => window.location.href = `mailto:${c.email}`} className="rounded p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50" title="Email">
            <Mail className="h-4 w-4" />
          </button>
        </div>
      ),
      className: "w-28",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Cobranza</h1>
        <p className="text-sm text-gray-500">Clientes con saldo pendiente</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-default bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-red-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Total Morosos</p>
              <p className="mt-0.5 text-xl font-bold text-primary">{stats.totalMorosos}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-default bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Deuda Total</p>
              <p className="mt-0.5 text-xl font-bold text-primary">{formatCurrency(stats.deudaTotal)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-default bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Cobrado Total</p>
              <p className="mt-0.5 text-xl font-bold text-emerald-600">{formatCurrency(stats.cobradoTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar cliente..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchInput && (
          <button onClick={() => { setSearchInput(""); setQ(""); setPage(0); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(c) => c.id}
          isLoading={isLoading}
          emptyMessage={q ? "No se encontraron clientes" : "No hay clientes con saldo pendiente"}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Página {page + 1} de {totalPages}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Siguiente <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
