import api from "./api";
import type { AuditoriaMbDto, PageResponse } from "../types";

export const auditoriaService = {
  getAll: (page = 0, size = 20) =>
    api.get<PageResponse<AuditoriaMbDto>>("/auditoria", { params: { page, size } }).then((r) => r.data),
};
