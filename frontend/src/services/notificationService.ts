import api from "./api";
import type { NotificacionMbDto, PageResponse } from "../types";

export const notificationService = {
  getAll: (page = 0, size = 20) =>
    api.get<PageResponse<NotificacionMbDto>>("/notifications", { params: { page, size } }).then((r) => r.data),

  getUnread: () =>
    api.get<NotificacionMbDto[]>("/notifications/unread").then((r) => r.data),

  getCount: () =>
    api.get<{ count: number }>("/notifications/unread/count").then((r) => r.data),

  markRead: (id: number) =>
    api.put(`/notifications/${id}/read`).then((r) => r.data),

  markAllRead: () =>
    api.put("/notifications/read-all").then((r) => r.data),
};
