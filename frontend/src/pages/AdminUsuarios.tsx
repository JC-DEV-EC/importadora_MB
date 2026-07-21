import { useState, useEffect } from "react";
import api from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { Shield, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { UsuarioDto } from "../types";

export function AdminUsuarios() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<UsuarioDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 15;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/usuarios");
      setData(res.data ?? []);
    } catch { setData([]); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRoleChange = async (id: number, rol: string) => {
    try {
      await api.put(`/usuarios/${id}/rol`, null, { params: { rol } });
      toast("success", "Rol actualizado");
      fetchData();
    } catch { toast("error", "Error al actualizar el rol"); }
  };

  const handleToggleStatus = async (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    try {
      await api.put(`/usuarios/${id}/estado`, null, { params: { estado: nuevoEstado } });
      toast("success", "Estado actualizado");
      fetchData();
    } catch { toast("error", "Error al cambiar el estado"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/usuarios/${deleteId}`);
      toast("success", "Usuario eliminado");
      setDeleteId(null);
      fetchData();
    } catch { toast("error", "Error al eliminar el usuario"); }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Shield className="h-12 w-12 text-muted" />
        <p className="text-secondary font-medium">Acceso restringido</p>
        <p className="text-sm text-muted">Solo los administradores pueden gestionar usuarios</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / pageSize);
  const pageData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Usuarios</h1>
        <p className="mt-1 text-sm text-secondary">{data.length} usuarios registrados</p>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Shield className="h-12 w-12 text-muted" />
            <p className="mt-3 text-sm font-medium text-secondary">Sin usuarios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border-light">
              <thead>
                <tr className="bg-surface">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted">Rol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y border-light">
                {pageData.map((u) => (
                  <tr key={u.id} className="bg-card transition-colors">
                    <td className="px-4 py-3 text-sm text-primary">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-primary">{u.nombre}</td>
                    <td className="px-4 py-3">
                      <select value={u.rol} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="rounded-lg border border-default bg-card px-2.5 py-1.5 text-sm text-primary focus:border-mb-400 focus:outline-none focus:ring-2 focus:ring-mb-400/20">
                        <option value="AGENT">AGENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.estado === "ACTIVO" ? "active" : "cancelled"}>{u.estado === "ACTIVO" ? "Activo" : "Inactivo"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => handleToggleStatus(u.id, u.estado)}>
                          {u.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(u.id)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
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
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Siguiente <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Eliminar Usuario">
        <p className="text-sm text-secondary mb-4">¿Estás seguro de eliminar este usuario?</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
