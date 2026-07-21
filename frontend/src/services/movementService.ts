import api from "./api";
import type { MovimientoMbDto, PageResponse } from "../types";

export const movementService = {
  getByClientId: (clientId: number, page = 0, size = 20) =>
    api.get<PageResponse<MovimientoMbDto>>(`/clients/${clientId}/movements`, { params: { page, size } }).then((r) => r.data),

  getAllByClientId: (clientId: number) =>
    api.get<MovimientoMbDto[]>(`/clients/${clientId}/movements`, { params: { all: true } }).then((r) => r.data),
};