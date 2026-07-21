import { useState, useEffect } from "react";
import api from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { useToast } from "../components/ui/Toast";
import { FileText, Plus, Pencil, Trash2, X } from "lucide-react";
import type { PlantillaMbDto } from "../types";

const defaultForm = { nombre: "", tipo: "RECORDATORIO", asunto: "", cuerpo: "", variables: "" };

export function Plantillas() {
  const { toast } = useToast();
  const [data, setData] = useState<PlantillaMbDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PlantillaMbDto | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/plantillas");
      setData(res.data ?? []);
    } catch { setData([]); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (item: PlantillaMbDto) => {
    setEditing(item);
    setForm({ nombre: item.nombre, tipo: item.tipo, asunto: item.asunto ?? "", cuerpo: item.cuerpo, variables: item.variables ?? "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.cuerpo.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, activo: editing?.activo ?? true };
      if (editing) {
        await api.put(`/plantillas/${editing.id}`, payload);
        toast("success", "Plantilla actualizada");
      } else {
        await api.post("/plantillas", payload);
        toast("success", "Plantilla creada");
      }
      setModalOpen(false);
      fetchData();
    } catch { toast("error", "Error al guardar la plantilla"); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/plantillas/${deleteId}`);
      toast("success", "Plantilla eliminada");
      setDeleteId(null);
      fetchData();
    } catch { toast("error", "Error al eliminar la plantilla"); }
  };

  const handleToggle = async (item: PlantillaMbDto) => {
    try {
      await api.put(`/plantillas/${item.id}`, { ...item, activo: !item.activo });
      fetchData();
    } catch { toast("error", "Error al cambiar el estado"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Plantillas</h1>
          <p className="mt-1 text-sm text-secondary">Gestiona las plantillas de comunicación</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Nueva Plantilla</Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted" />
            <p className="mt-3 text-sm font-medium text-secondary">Sin plantillas</p>
            <p className="text-xs text-muted">Crea tu primera plantilla para empezar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border-light">
              <thead>
                <tr className="bg-surface">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted">Asunto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y border-light">
                {data.map((item) => (
                  <tr key={item.id} className="bg-card transition-colors hover:bg-surface/50">
                    <td className="px-4 py-3 text-sm font-medium text-primary">{item.nombre}</td>
                    <td className="px-4 py-3 text-sm text-secondary">{item.tipo}</td>
                    <td className="px-4 py-3 text-sm text-secondary max-w-[200px] truncate">{item.asunto ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={item.activo ? "active" : "cancelled"}>{item.activo ? "Activa" : "Inactiva"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggle(item)} className={item.activo ? "text-rose-500" : "text-emerald-500"}>
                          {item.activo ? <X className="h-4 w-4" /> : "Activar"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Plantilla" : "Nueva Plantilla"}>
        <div className="space-y-4">
          <Input label="Nombre" placeholder="Ej: Recordatorio de pago" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <div>
            <label className="mb-1 block text-sm font-medium text-primary">Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full rounded-lg border border-default bg-card px-3 py-2 text-sm text-primary focus:border-mb-400 focus:outline-none focus:ring-2 focus:ring-mb-400/20">
              <option value="RECORDATORIO">Recordatorio</option>
              <option value="COBRO">Cobro</option>
              <option value="NOTIFICACION">Notificación</option>
              <option value="PROMOCION">Promoción</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <Input label="Asunto (opcional)" placeholder="Ej: Recordatorio de pago pendiente" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} />
          <div>
            <label className="mb-1 block text-sm font-medium text-primary">Cuerpo</label>
            <textarea value={form.cuerpo} onChange={(e) => setForm({ ...form, cuerpo: e.target.value })} rows={5} placeholder="Ej: Estimado cliente, recuerde que tiene un pago pendiente..." className="w-full rounded-lg border border-default bg-card px-3 py-2 text-sm text-primary focus:border-mb-400 focus:outline-none focus:ring-2 focus:ring-mb-400/20 resize-y" />
          </div>
          <Input label="Variables (opcional, separadas por coma)" placeholder="Ej: {nombre}, {monto}, {fecha}" value={form.variables} onChange={(e) => setForm({ ...form, variables: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} isLoading={saving} disabled={!form.nombre.trim() || !form.cuerpo.trim()}>
              {editing ? "Guardar" : "Crear"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Eliminar Plantilla">
        <p className="text-sm text-secondary mb-4">¿Estás seguro de eliminar esta plantilla?</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
