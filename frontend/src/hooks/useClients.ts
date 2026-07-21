import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientService } from "../services/clientService";
import type {
  ClientCreateRequest,
  ClientUpdateRequest,
  ClientChargeRequest,
  ClientPaymentRequest,
} from "../types";

export function useClients(page = 0, size = 20, q?: string) {
  return useQuery({
    queryKey: ["clients", page, size, q],
    queryFn: () => clientService.getAll(page, size, q),
  });
}

export function useAllClients() {
  return useQuery({
    queryKey: ["clients", "all"],
    queryFn: clientService.getAllLegacy,
  });
}

export function useClient(id: number | null) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientService.getById(id!),
    enabled: id !== null,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ClientCreateRequest) => clientService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClientUpdateRequest }) =>
      clientService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useAddCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ClientChargeRequest;
    }) => clientService.addCharge(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["movements", variables.id] });
    },
  });
}

export function useAddPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ClientPaymentRequest;
    }) => clientService.addPayment(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["movements", variables.id] });
    },
  });
}