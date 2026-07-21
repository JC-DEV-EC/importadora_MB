import api from "./api";
import type { PlantillaMbDto } from "../types";

export const plantillaService = {
  getAll: () =>
    api.get<PlantillaMbDto[]>("/plantillas").then((r) => r.data),

  getById: (id: number) =>
    api.get<PlantillaMbDto>(`/plantillas/${id}`).then((r) => r.data),

  getByTipo: (tipo: string) =>
    api.get<PlantillaMbDto[]>("/plantillas", { params: { tipo } }).then((r) => r.data),

  create: (data: Omit<PlantillaMbDto, "id" | "createdAt">) =>
    api.post<PlantillaMbDto>("/plantillas", data).then((r) => r.data),

  update: (id: number, data: Partial<PlantillaMbDto>) =>
    api.put<PlantillaMbDto>(`/plantillas/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/plantillas/${id}`),
};
