import { cn } from "../../lib/utils";

interface BadgeProps {
  variant?: "active" | "cancelled" | "pending" | "info" | "default";
  children: React.ReactNode;
  className?: string;
}

const config = {
  active: { cls: "badge-active", dot: "bg-emerald-500" },
  cancelled: { cls: "badge-cancelled", dot: "bg-rose-500" },
  pending: { cls: "badge-pending", dot: "bg-amber-500" },
  info: { cls: "badge-info", dot: "bg-sky-500" },
  default: { cls: "badge-default", dot: "bg-slate-400" },
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  const c = config[variant] || config.default;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        c.cls,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {children}
    </span>
  );
}
