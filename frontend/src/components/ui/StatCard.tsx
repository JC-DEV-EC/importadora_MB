import { cn } from "../../lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  color?: "navy" | "accent" | "emerald" | "amber" | "rose";
}

const colorConfig = {
  navy: { bg: "bg-mb-50", icon: "text-mb-600", bar: "from-mb-500 to-mb-700" },
  accent: { bg: "bg-accent-100", icon: "text-accent-600", bar: "from-accent-500 to-accent-600" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", bar: "from-emerald-500 to-emerald-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", bar: "from-amber-500 to-amber-600" },
  rose: { bg: "bg-rose-50", icon: "text-rose-600", bar: "from-rose-500 to-rose-600" },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "navy",
}: StatCardProps) {
  const c = colorConfig[color];
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className={cn("absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b", c.bar)} />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-slate-500">{title}</span>
          <div className={cn("rounded-lg p-2.5 transition-colors", c.bg, c.icon)}>
            {icon}
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-display tracking-tight text-slate-900">
            {value}
          </span>
          {subtitle && (
            <span className="ml-2 text-xs text-slate-400">{subtitle}</span>
          )}
        </div>
        {trend && trendValue && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            )}>
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trendValue}
            </span>
            <span className="text-[11px] text-slate-400">vs mes anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}
