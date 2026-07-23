import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle, CheckCheck, ChevronLeft, ChevronRight, MailOpen, Bell } from "lucide-react";
import { cn } from "../lib/utils";
import { notificationService } from "../services/notificationService";

const typeIcon: Record<string, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
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

export default function Notificaciones() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const size = 15;
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["notifications", page, size],
    queryFn: () => notificationService.getAll(page, size),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
    onError: () => toast("error", "Error al marcar como leída"),
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
  const unreadCount = notifications.filter((n) => !n.leido).length;

  return (
    <div className="space-y-6">
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

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-12 w-12 text-muted" />
            <p className="mt-4 text-sm font-medium text-secondary">Sin notificaciones</p>
            <p className="text-xs text-muted">Las notificaciones aparecerán aquí</p>
          </div>
        ) : (
          <div>
            {notifications.map((n) => {
              const Icon = typeIcon[n.tipo] || Info;
              return (
                <div
                  key={n.id}
                  onClick={() => n.clienteId && navigate(`/clients/${n.clienteId}`)}
                  className={cn(
                    "flex items-start gap-4 px-5 py-4 transition-colors hover-bg rounded-lg group",
                    !n.leido && "bg-surface"
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-secondary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm", n.leido ? "text-secondary" : "font-medium text-primary")}>
                        {n.mensaje}
                      </p>
                      {!n.leido && <span className="h-2 w-2 rounded-full shrink-0 bg-mb-500" />}
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xs text-muted">{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.leido ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); markReadMutation.mutate(n.id); }}
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
