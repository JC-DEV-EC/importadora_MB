import api from "./api";
import type { NotificacionMbDto, PageResponse } from "../types";

export const notificationService = {
  getAll: (page = 0, size = 20) =>
    api.get<PageResponse<NotificacionMbDto>>("/notificaciones", { params: { page, size } }).then((r) => r.data),

  getUnread: () =>
    api.get<NotificacionMbDto[]>("/notificaciones/no-leidas").then((r) => r.data),

  getCount: () =>
    api.get<{ count: number }>("/notificaciones/count").then((r) => r.data),

  markRead: (id: number) =>
    api.put(`/notificaciones/${id}/leer`).then((r) => r.data),

  markAllRead: () =>
    api.put("/notificaciones/leer-todas").then((r) => r.data),
};
