import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-1 ring-red-600/20";
    default:
      return "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Activo";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status;
  }
}
