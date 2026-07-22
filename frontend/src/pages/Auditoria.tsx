import { useState, useEffect } from "react";
import api from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ChevronLeft, ChevronRight, ClipboardList, Search } from "lucide-react";
import { formatDate } from "../lib/utils";
import type { AuditoriaMbDto, PageResponse } from "../types";

const auditoriaService = {
  getAll: (page: number, size: number, entidad?: string) =>
    api.get<PageResponse<AuditoriaMbDto>>("/auditoria", { params: { page, size, entidad: entidad !== "ALL" ? entidad : undefined } }).then((r) => r.data),
};

const entidades = ["ALL", "CLIENTE", "USUARIO", "PLANTILLA"];

export function Auditoria() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<AuditoriaMbDto[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [entidad, setEntidad] = useState("ALL");
  const size = 20;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await auditoriaService.getAll(page, size, entidad);
      setData(res.content ?? []);
      setTotalPages(res.totalPages ?? 0);
      setTotalElements(res.totalElements ?? 0);
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, entidad]);

  const actionBadge = (accion: string) => {
    const cfg: Record<string, string> = {
      CREAR: "bg-emerald-50 text-emerald-700",
      ACTUALIZAR: "bg-sky-50 text-sky-700",
      ELIMINAR: "bg-rose-50 text-rose-700",
      PAGO: "bg-blue-50 text-blue-700",
      CARGO: "bg-amber-50 text-amber-700",
    };
    return cfg[accion] || "bg-slate-50 text-slate-700";
  };

  return (
    <div className="space-y-6 ">
      <div>
        <h1 className="text-2xl font-bold  text-primary">Auditoría de Cambios</h1>
        <p className="mt-1 text-sm text-secondary">{totalElements} registros en el log</p>
      </div>

      <div className="flex items-center gap-3">
        <Search className="h-4 w-4 text-muted" />
        <select
          value={entidad}
          onChange={(e) => { setEntidad(e.target.value); setPage(0); }}
          className="rounded-lg border border-default bg-card px-3.5 py-2.5 text-sm text-primary focus:border-mb-400 focus:outline-none focus:ring-2 focus:ring-mb-400/20"
        >
          {entidades.map((e) => (
            <option key={e} value={e}>{e === "ALL" ? "TODOS" : e}</option>
          ))}
        </select>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="h-12 w-12 text-muted" />
            <p className="mt-4 text-sm font-medium text-secondary">Sin registros de auditoría</p>
            <p className="text-xs text-muted">Los cambios realizados aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border-light">
              <thead>
                <tr className="bg-surface">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Acción</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Entidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y border-light">
                {data.map((a) => (
                  <tr key={a.id} className="bg-card transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">{formatDate(a.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-primary">{a.usuarioNombre}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${actionBadge(a.accion)}`}>
                        {a.accion}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-secondary">{a.entidad}{a.entidadId ? ` #${a.entidadId}` : ""}</td>
                    <td className="px-4 py-3 text-sm text-secondary max-w-xs truncate">{a.detalle || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">Página {page + 1} de {totalPages}</p>
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
    </div>
  );
}
