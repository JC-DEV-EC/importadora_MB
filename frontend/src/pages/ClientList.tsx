import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClients, useDeleteClient } from "../hooks/useClients";
import { DataTable, type Column } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Card } from "../components/ui/Card";
import { useToast } from "../components/ui/Toast";
import { Plus, Search, Trash2, Eye, Download, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn, formatCurrency, formatDate, getStatusLabel } from "../lib/utils";
import { clientService } from "../services/clientService";
import type { ClienteMbDto } from "../types";

export function ClientList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") ?? "0", 10);
  const size = 15;
  const q = searchParams.get("q") ?? "";

  const { data: pageData, isLoading } = useClients(page, size, q || undefined);
  const deleteMutation = useDeleteClient();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState(q);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchInput.trim()) params.set("q", searchInput.trim());
      params.set("page", "0");
      setSearchParams(params);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams();
    params.set("page", "0");
    setSearchParams(params);
  };

  const filtered = (pageData?.content ?? []).filter((c) =>
    statusFilter === "ALL" || c.status === statusFilter
  );

  const columns: Column<ClienteMbDto>[] = [
    {
      key: "fullName",
      header: "Cliente",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mb-100 text-xs font-semibold text-mb-700">
            {c.fullName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-primary truncate">{c.fullName}</p>
            {c.city && <p className="text-xs text-muted truncate">{c.city}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "registrationDate",
      header: "Registro",
      sortable: true,
      render: (c) => <span className="text-secondary text-sm">{formatDate(c.registrationDate)}</span>,
      hideOnMobile: true,
    },
    {
      key: "debt",
      header: "Deuda",
      sortable: true,
      render: (c) => <span className="font-mono text-sm font-medium text-primary">{formatCurrency(c.debt)}</span>,
      className: "text-right",
    },
    {
      key: "payment",
      header: "Pagado",
      sortable: true,
      render: (c) => <span className="font-mono text-sm text-emerald-600">{formatCurrency(c.payment)}</span>,
      className: "text-right hidden lg:table-cell",
      hideOnMobile: true,
    },
    {
      key: "totalAmount",
      header: "Saldo",
      sortable: true,
      render: (c) => (
        <span className={cn("font-mono text-sm font-medium", c.totalAmount <= 0 ? "text-emerald-600" : "text-primary")}>
          {formatCurrency(c.totalAmount)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "status",
      header: "Estado",
      render: (c) => <Badge variant={c.status === "ACTIVE" ? "active" : "cancelled"}>{getStatusLabel(c.status)}</Badge>,
    },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/clients/${c.id}`); }}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(c.id); }} className="text-rose-500 hover:text-rose-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "w-20",
    },
  ];

  const totalPages = pageData?.totalPages ?? 0;
  const totalElements = pageData?.totalElements ?? 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-primary">Clientes</h1>
          <p className="mt-1 text-sm text-secondary">{totalElements} clientes registrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { clientService.exportCsv(); toast("success", "CSV exportado correctamente"); }}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={() => navigate("/clients/new")}>
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Buscar por nombre o ciudad..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(["ALL", "ACTIVE", "CANCELLED"] as const).map((s) => (
            <Button key={s} variant={statusFilter === s ? "primary" : "secondary"} size="sm" onClick={() => setStatusFilter(s)}>
              {s === "ALL" ? "Todos" : s === "ACTIVE" ? "Activos" : "Cancelados"}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(c) => c.id}
          onRowClick={(c) => navigate(`/clients/${c.id}`)}
          isLoading={isLoading}
          emptyMessage={q || statusFilter !== "ALL" ? "No se encontraron clientes con esos filtros" : "No hay clientes registrados"}
        />
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Página {page + 1} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Eliminar Cliente">
        <div className="space-y-4">
          <p className="text-sm text-secondary">¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="danger" isLoading={deleteMutation.isPending} onClick={() => { if (deleteId !== null) deleteMutation.mutate(deleteId, { onSuccess: () => { setDeleteId(null); toast("success", "Cliente eliminado correctamente"); }, onError: () => toast("error", "Error al eliminar el cliente") }); }}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
