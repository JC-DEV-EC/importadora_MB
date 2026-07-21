import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../components/ui/Toast";
import { Settings, Save, Pencil } from "lucide-react";
import type { ConfiguracionMbDto } from "../types";

const configService = {
  getAll: () => api.get<ConfiguracionMbDto[]>("/configuracion").then((r) => r.data),
  update: (id: number, valor: string) =>
    api.patch(`/configuracion/${id}`, { valor }).then((r) => r.data),
};

export function Configuracion() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ConfiguracionMbDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await configService.getAll();
      setSettings(data ?? []);
    } catch {
      setSettings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const startEdit = (s: ConfiguracionMbDto) => {
    setEditingId(s.id);
    setEditValue(s.valor);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveSetting = useCallback(async (id: number) => {
    setSavingId(id);
    try {
      await configService.update(id, editValue);
      setSettings((prev) => prev.map((s) => s.id === id ? { ...s, valor: editValue } : s));
      setEditingId(null);
      toast("success", "Configuración actualizada correctamente");
    } catch {
      toast("error", "Error al actualizar la configuración");
    } finally {
      setSavingId(null);
    }
  }, [editValue, toast]);

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") saveSetting(id);
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-display text-primary">Configuración del Sistema</h1>
        <p className="mt-1 text-sm text-secondary">Administra las variables de configuración</p>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
          </div>
        ) : settings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Settings className="h-12 w-12 text-muted" />
            <p className="mt-4 text-sm font-medium text-secondary">Sin configuraciones</p>
            <p className="text-xs text-muted">No hay variables de configuración disponibles</p>
          </div>
        ) : (
          <div className="divide-y border-light">
            {settings.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-4 py-4 sm:px-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary font-mono">{s.clave}</span>
                  </div>
                  {s.descripcion && (
                    <p className="text-xs text-muted mt-0.5">{s.descripcion}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 w-64">
                  {editingId === s.id ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, s.id)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => saveSetting(s.id)} isLoading={savingId === s.id}>
                        <Save className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-secondary truncate text-right font-mono">{s.valor}</span>
                      <Button variant="ghost" size="sm" onClick={() => startEdit(s)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
