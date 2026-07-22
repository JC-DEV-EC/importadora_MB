import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Calendar,
  Bell,
  BarChart3,
  FileText,
  Shield,
  ClipboardList,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navGroups = [
  {
    label: "Menú",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
      { to: "/clients", icon: Users, label: "Clientes" },
      { to: "/cobranza", icon: AlertTriangle, label: "Cobranza" },
      { to: "/calendario", icon: Calendar, label: "Calendario" },
      { to: "/notificaciones", icon: Bell, label: "Notificaciones" },
      { to: "/reportes", icon: BarChart3, label: "Reportes" },
    ],
  },
  {
    label: "Administración",
    items: [
      { to: "/plantillas", icon: FileText, label: "Plantillas" },
      { to: "/admin/usuarios", icon: Shield, label: "Usuarios" },
      { to: "/auditoria", icon: ClipboardList, label: "Auditoría" },
      { to: "/configuracion", icon: Settings, label: "Configuración" },
    ],
  },
];



export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-gradient-to-b from-mb-900 via-mb-900 to-mb-800 text-white transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <span className="text-sm font-bold text-white">MB</span>
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-white">Importadora MB</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {navGroups.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? "mt-6" : ""}>
              <div className="mb-2 flex items-center gap-2 px-3">
                {gi > 0 && <div className="flex-1 border-t border-white/10" />}
                <p className="text-[11px] font-medium text-white/30 shrink-0">
                  {group.label}
                </p>
                {gi > 0 && <div className="flex-1 border-t border-white/10" />}
              </div>
              <nav className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end ?? false}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white/80"
                      )
                    }
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          <p className="text-[11px] text-white/30">&copy; {new Date().getFullYear()} Importadora MB</p>
        </div>
      </aside>
    </>
  );
}
