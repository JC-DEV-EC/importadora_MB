import api from "./api";
import type { DashboardData } from "../types";

export const reporteService = {
  getDashboard: () =>
    api.get<DashboardData>("/reportes/dashboard").then((r) => r.data),
};
