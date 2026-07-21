import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle, CheckCheck, ChevronLeft, ChevronRight, Mail, MailOpen } from "lucide-react";
import { cn } from "../lib/utils";
import type { PageResponse } from "../types";

interface NotificationDto {
  id: number;
  type: "success" | "error" | "warning" | "info";
  message: string;
  read: boolean;
  timestamp: string;
  clienteId?: number;
  relatedClient?: string;
}

const notificationService = {
  getAll: (page: number, size: number) =>
    api.get<PageResponse<NotificationDto>>("/notifications", { params: { page, size } }).then((r) => r.data),
  markRead: (id: number) =>
    api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () =>
    api.patch("/notifications/read-all").then((r) => r.data),
};

export function useNotifications(page: number, size: number) {
  return useQuery({
    queryKey: ["notifications", page, size],
    queryFn: () => notificationService.getAll(page, size),
  });
}

const typeConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; dot: string }> = {
  success: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  error: { icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50", dot: "bg-rose-500" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
  info: { icon: Info, color: "text-sky-600", bg: "bg-sky-50", dot: "bg-sky-500" },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short" }).format(new Date(timestamp));
}

export function Notificaciones() {
  const [page, setPage] = useState(0);
  const size = 15;
  const { data: pageData, isLoading } = useNotifications(page, size);
  const qc = useQueryClient();
  const { toast } = useToast();

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast("success", "Todas las notificaciones marcadas como leídas");
    },
  });

  const notifications = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;
  const totalElements = pageData?.totalElements ?? 0;
  const unreadCount = totalElements - notifications.filter((n) => n.read).length;

  return (
    <div className="space-y-6" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Notificaciones</h1>
          <p className="mt-1 text-sm text-secondary">{totalElements} notificaciones</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllMutation.mutate()}
            isLoading={markAllMutation.isPending}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas como leídas
          </Button>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Mail className="h-12 w-12 text-muted" />
            <p className="mt-4 text-sm font-medium text-secondary">Sin notificaciones</p>
            <p className="text-xs text-muted">Las notificaciones aparecerán aquí</p>
          </div>
        ) : (
          <div className="divide-y border-light" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {notifications.map((n) => {
              const cfg = typeConfig[n.type] || typeConfig.info;
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-4 px-5 py-4 transition-colors",
                    !n.read && "bg-mb-50/40"
                  )}
                >
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", cfg.bg)}>
                    <Icon className={cn("h-4.5 w-4.5", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm", n.read ? "text-secondary" : "font-medium text-primary")}>
                        {n.message}
                      </p>
                      {!n.read && <span className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} />}
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xs text-muted">{timeAgo(n.timestamp)}</span>
                      {n.relatedClient && (
                        <span className="text-xs text-mb-600">{n.relatedClient}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.read ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markReadMutation.mutate(n.id)}
                        isLoading={markReadMutation.isPending}
                      >
                        <MailOpen className="h-3.5 w-3.5" />
                        Leído
                      </Button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <MailOpen className="h-3 w-3" />
                        Leída
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Página {page + 1} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
