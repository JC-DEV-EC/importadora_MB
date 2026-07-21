import api from "./api";
import type { CalendarioEvento } from "../types";

export const calendarioService = {
  getEventos: (start: string, end: string) =>
    api.get<CalendarioEvento[]>("/calendario", { params: { start, end } }).then((r) => r.data),
};
