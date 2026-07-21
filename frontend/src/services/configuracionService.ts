import api from "./api";
import type { ConfiguracionMbDto } from "../types";

export const configuracionService = {
  getAll: () =>
    api.get<ConfiguracionMbDto[]>("/configuracion").then((r) => r.data),

  getByClave: (clave: string) =>
    api.get<ConfiguracionMbDto>(`/configuracion/${clave}`).then((r) => r.data),

  update: (clave: string, valor: string) =>
    api.put<ConfiguracionMbDto>(`/configuracion/${clave}`, { valor }).then((r) => r.data),

  create: (data: Omit<ConfiguracionMbDto, "id">) =>
    api.post<ConfiguracionMbDto>("/configuracion", data).then((r) => r.data),
};
