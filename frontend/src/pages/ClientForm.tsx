import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useClient, useCreateClient, useUpdateClient } from "../hooks/useClients";
import { Card, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { ArrowLeft } from "lucide-react";
import { configuracionService } from "../services/configuracionService";

export default function ClientForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined;
  const clientId = isEdit ? Number(id) : null;
  const { data: existing, isLoading: loadingExisting } = useClient(clientId);
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [initialDebt, setInitialDebt] = useState("");
  const [discount, setDiscount] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cedula, setCedula] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: descConfig } = useQuery({
    queryKey: ["config", "descuento_porcentaje"],
    queryFn: () => configuracionService.getByClave("descuento_porcentaje"),
    staleTime: 60000,
  });
  const descPct = descConfig?.valor ?? "10";

  useEffect(() => {
    if (existing) {
      const parts = existing.fullName.split(" ");
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" ") ?? "");
      setCity(existing.city ?? "");
      setDiscount(existing.discount ?? false);
      setPhone(existing.phone ?? "");
      setEmail(existing.email ?? "");
      setCedula(existing.cedula ?? "");
    }
  }, [existing]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "El nombre es requerido";
    if (!lastName.trim()) errs.lastName = "El apellido es requerido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEdit && clientId) {
      updateMutation.mutate(
        { id: clientId, data: { firstName: firstName.trim(), lastName: lastName.trim(), city: city.trim() || undefined, discount, phone: phone.trim() || undefined, email: email.trim() || undefined, cedula: cedula.trim() || undefined } },
        { onSuccess: () => { navigate(`/clients/${clientId}`); toast("success", "Cliente actualizado correctamente"); }, onError: () => toast("error", "Error al actualizar el cliente") }
      );
    } else {
      createMutation.mutate(
        { firstName: firstName.trim(), lastName: lastName.trim(), city: city.trim() || undefined, initialDebt: initialDebt ? parseFloat(initialDebt) : undefined, discount: discount || undefined, phone: phone.trim() || undefined, email: email.trim() || undefined, cedula: cedula.trim() || undefined },
        { onSuccess: (data) => { navigate(`/clients/${data.id}`); toast("success", "Cliente creado correctamente", data.id); }, onError: () => toast("error", "Error al crear el cliente") }
      );
    }
  };

  if (isEdit && loadingExisting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 ">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(isEdit ? `/clients/${clientId}` : "/clients")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold  text-primary">
            {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
          </h1>
          <p className="text-sm text-secondary">
            {isEdit ? "Actualiza los datos del cliente" : "Registra un nuevo cliente en el sistema"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-primary">Información Personal</h2>
        </CardHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="firstName" label="Nombre" placeholder="Ej: Juan" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={errors.firstName} />
            <Input id="lastName" label="Apellido" placeholder="Ej: Pérez" value={lastName} onChange={(e) => setLastName(e.target.value)} error={errors.lastName} />
          </div>
          <Input id="city" label="Ciudad" placeholder="Ej: Santa Cruz" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input id="phone" label="Teléfono" placeholder="Ej: 70012345" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input id="email" label="Correo Electrónico" type="email" placeholder="Ej: cliente@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input id="cedula" label="Cédula / Identificación" placeholder="Ej: 1234567" value={cedula} onChange={(e) => setCedula(e.target.value)} />
          {!isEdit && (
            <Input id="initialDebt" label="Deuda Inicial" type="number" step="0.01" min="0" placeholder="0.00" value={initialDebt} onChange={(e) => setInitialDebt(e.target.value)} hint="Deja en 0 si no tiene deuda inicial" />
          )}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-default p-3 transition-colors hover-bg">
            <input type="checkbox" checked={discount} onChange={(e) => setDiscount(e.target.checked)} className="h-4 w-4 rounded text-mb-700 focus:ring-mb-400" style={{ borderColor: "var(--border)" }} />
            <div>
              <span className="text-sm font-medium text-primary">Aplicar descuento del {descPct}%</span>
              <p className="text-xs text-muted">El saldo final se reducirá automáticamente</p>
            </div>
          </label>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(isEdit ? `/clients/${clientId}` : "/clients")}>Cancelar</Button>
        <Button onClick={handleSubmit} isLoading={createMutation.isPending || updateMutation.isPending}>
          {isEdit ? "Guardar Cambios" : "Crear Cliente"}
        </Button>
      </div>
    </div>
  );
}
