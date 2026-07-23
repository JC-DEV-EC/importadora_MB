import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { formatCurrency } from "../lib/utils";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import type { CalendarioEvento } from "../types";

const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function useMonthNavigation() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const prev = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else { setMonth(m => m - 1); } };
  const next = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else { setMonth(m => m + 1); } };
  return { year, month, prev, next };
}

export default function Calendario() {
  const navigate = useNavigate();
  const { year, month, prev, next } = useMonthNavigation();
  const [events, setEvents] = useState<CalendarioEvento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  useEffect(() => {
    const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;
    setIsLoading(true);
    api.get("/calendario", { params: { start, end } })
      .then((res) => setEvents(res.data ?? []))
      .catch(() => setEvents([]))
      .finally(() => setIsLoading(false));
  }, [year, month, daysInMonth]);

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarioEvento[]> = {};
    events.forEach((e) => {
      if (!e.date) return;
      (map[e.date] ??= []).push(e);
    });
    return map;
  }, [events]);

  const todayStr = new Date().toISOString().slice(0, 10);

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push(dateStr);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Calendario</h1>
        <p className="mt-1 text-sm text-secondary">Eventos y movimientos del mes</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={prev}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-base font-semibold text-primary">{monthNames[month]} {year}</h2>
          <Button variant="ghost" size="sm" onClick={next}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {daysOfWeek.map((d) => (
                <div key={d} className="bg-surface px-2 py-2 text-center text-xs font-semibold text-muted">{d}</div>
              ))}
              {calendarDays.map((dateStr, idx) => {
                if (!dateStr) return <div key={`empty-${idx}`} className="bg-card min-h-[80px] p-1" />;
                const dayEvents = eventsByDay[dateStr] ?? [];
                const isToday = dateStr === todayStr;
                const dayNum = parseInt(dateStr.slice(8), 10);
                return (
                  <div key={dateStr} className={`bg-card min-h-[80px] p-1 border border-light ${isToday ? "ring-1 ring-mb-400" : ""}`}>
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${isToday ? "bg-mb-600 text-white font-bold" : "text-primary"}`}>
                      {dayNum}
                    </span>
                    <div className="mt-1 max-h-[52px] overflow-y-auto space-y-0.5 scrollbar-thin">
                      {dayEvents.map((ev, i) => (
                        <button
                          key={i}
                          onClick={() => navigate(`/clients/${ev.clienteId}`)}
                          className="block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium bg-surface text-muted"
                        >
                          <span className="text-[9px] text-secondary">{ev.clienteNombre?.split(" ")[0]}</span> {ev.tipo === "CARGO" ? "+" : "-"}{ev.monto != null ? formatCurrency(ev.monto) : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-primary mb-3">Eventos del Mes</h2>
        {events.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">No hay movimientos este mes</p>
        ) : (
          <div className="max-h-64 overflow-y-auto scrollbar-thin -mx-1">
            {events.map((ev, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 hover-bg rounded-lg transition-colors cursor-pointer" onClick={() => navigate(`/clients/${ev.clienteId}`)}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-secondary">
                  {ev.tipo === "CARGO" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">{ev.clienteNombre ?? ev.title}</p>
                  <p className="text-xs text-muted">{ev.date} &middot; {ev.tipo === "CARGO" ? "Cargo" : "Abono"}</p>
                </div>
                <span className={`text-sm font-mono font-medium shrink-0 ${ev.tipo === "CARGO" ? "text-rose-600" : "text-emerald-600"}`}>
                  {ev.tipo === "CARGO" ? "+" : "-"}{ev.monto != null ? formatCurrency(ev.monto) : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
