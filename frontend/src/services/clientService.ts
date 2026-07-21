import api from "./api";
import type {
  ClienteMbDto,
  ClientCreateRequest,
  ClientUpdateRequest,
  ClientChargeRequest,
  ClientPaymentRequest,
  PageResponse,
} from "../types";

export const clientService = {
  getAll: (page = 0, size = 20, q?: string) =>
    api.get<PageResponse<ClienteMbDto>>("/clients", { params: { page, size, q } }).then((r) => r.data),

  getAllLegacy: () =>
    api.get<PageResponse<ClienteMbDto>>("/clients", { params: { page: 0, size: 9999 } }).then((r) => r.data.content),

  getById: (id: number) =>
    api.get<ClienteMbDto>(`/clients/${id}`).then((r) => r.data),

  create: (data: ClientCreateRequest) =>
    api.post<ClienteMbDto>("/clients", data).then((r) => r.data),

  update: (id: number, data: ClientUpdateRequest) =>
    api.put<ClienteMbDto>(`/clients/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/clients/${id}`),

  addCharge: (id: number, data: ClientChargeRequest) =>
    api.post<ClienteMbDto>(`/clients/${id}/charges`, data).then((r) => r.data),

  addPayment: (id: number, data: ClientPaymentRequest) =>
    api.post<ClienteMbDto>(`/clients/${id}/payments`, data).then((r) => r.data),

  exportCsv: () =>
    api.get("/clients/export", { params: { format: "csv" }, responseType: "blob" }).then((r) => {
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clientes.csv";
      a.click();
      URL.revokeObjectURL(url);
    }),
};