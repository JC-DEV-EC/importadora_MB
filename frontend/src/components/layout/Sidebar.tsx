import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
} from "lucide-react";
import { cn } from "../../lib/utils";

const mainNav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clientes" },
  { to: "/clients/new", icon: UserPlus, label: "Nuevo Cliente" },
];

function HandDrawnLines() {
  return (
    <svg viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full px-5 mb-1" preserveAspectRatio="none">
      <path d="M10 10 Q30 4 50 10 T90 10 T130 10 T170 10 T190 10" stroke="white" strokeOpacity="0.06" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M15 14 Q35 8 55 14 T95 14 T135 14 T175 14 T195 12" stroke="white" strokeOpacity="0.04" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function AnimatedCharacter() {
  return (
    <div className="relative flex items-center justify-center py-2 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-32 rounded-full bg-accent-500/5 blur-3xl animate-pulse-slow" />
      </div>
      <div className="relative animate-float-3d" style={{ transformStyle: "preserve-3d", perspective: "800px" }}>
        <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-auto drop-shadow-2xl">
          <defs>
            <linearGradient id="suitGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.15" />
              <stop offset="100%" stopColor="white" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="suitGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="50%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="0.05" />
            </linearGradient>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            <filter id="shadow3d">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="black" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Glow behind */}
          <ellipse cx="60" cy="120" rx="40" ry="8" fill="url(#glow)" />
          <ellipse cx="60" cy="120" rx="30" ry="5" fill="#F59E0B" fillOpacity="0.08" />

          {/* Shadow on ground */}
          <ellipse cx="60" cy="132" rx="28" ry="4" fill="black" fillOpacity="0.15" className="animate-shadow-pulse" />

          {/* === PERSON 1 (left, white/gray) === */}
          <g filter="url(#shadow3d)">
            {/* Legs */}
            <rect x="24" y="100" width="10" height="22" rx="3" fill="white" fillOpacity="0.08" />
            <rect x="36" y="100" width="10" height="22" rx="3" fill="white" fillOpacity="0.06" />
            {/* Shoes */}
            <rect x="23" y="118" width="12" height="5" rx="2.5" fill="white" fillOpacity="0.15" />
            <rect x="35" y="118" width="12" height="5" rx="2.5" fill="white" fillOpacity="0.1" />
            {/* Body / jacket */}
            <path d="M20 58 L18 95 L26 98 L30 75 L34 75 L38 98 L46 95 L44 58 Z" fill="url(#suitGrad)" stroke="white" strokeOpacity="0.06" strokeWidth="0.5" />
            {/* Shine */}
            <path d="M26 58 L24 85 L28 86 L30 65 Z" fill="url(#shine)" />
            {/* Collar */}
            <path d="M28 58 L32 65 L36 58" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
            {/* Tie */}
            <rect x="30.5" y="60" width="3" height="14" rx="1" fill="#F59E0B" fillOpacity="0.12" />
            {/* Arms */}
            <ellipse cx="18" cy="70" rx="5" ry="16" fill="white" fillOpacity="0.07" transform="rotate(12, 18, 70)" />
            <ellipse cx="46" cy="68" rx="5" ry="18" fill="white" fillOpacity="0.05" transform="rotate(-15, 46, 68)" />
            {/* Hands */}
            <circle cx="16" cy="86" r="3.5" fill="white" fillOpacity="0.1" />
            <circle cx="48" cy="86" r="3.5" fill="white" fillOpacity="0.08" />
          </g>

          {/* Head person 1 */}
          <g filter="url(#shadow3d)">
            <circle cx="32" cy="42" r="13" fill="white" fillOpacity="0.12" />
            <circle cx="32" cy="42" r="9" fill="white" fillOpacity="0.18" />
            {/* Hair */}
            <path d="M22 38 C22 30 28 28 32 28 C36 28 42 30 42 38" fill="white" fillOpacity="0.08" />
            {/* Face detail */}
            <circle cx="29" cy="41" r="1.2" fill="white" fillOpacity="0.15" />
            <circle cx="35" cy="41" r="1.2" fill="white" fillOpacity="0.15" />
            <path d="M29 45 C30 47 34 47 35 45" stroke="white" strokeOpacity="0.1" strokeWidth="0.8" fill="none" />
          </g>

          {/* === PERSON 2 (right, accent) === */}
          <g filter="url(#shadow3d)">
            {/* Legs */}
            <rect x="74" y="100" width="10" height="22" rx="3" fill="#F59E0B" fillOpacity="0.12" />
            <rect x="86" y="100" width="10" height="22" rx="3" fill="#F59E0B" fillOpacity="0.1" />
            {/* Shoes */}
            <rect x="73" y="118" width="12" height="5" rx="2.5" fill="#F59E0B" fillOpacity="0.2" />
            <rect x="85" y="118" width="12" height="5" rx="2.5" fill="#F59E0B" fillOpacity="0.15" />
            {/* Body / jacket */}
            <path d="M70 58 L68 95 L76 98 L80 75 L84 75 L88 98 L96 95 L94 58 Z" fill="url(#suitGrad2)" stroke="#F59E0B" strokeOpacity="0.08" strokeWidth="0.5" />
            {/* Shine */}
            <path d="M76 58 L74 85 L78 86 L80 65 Z" fill="url(#shine)" />
            {/* Collar */}
            <path d="M78 58 L82 65 L86 58" fill="#F59E0B" fillOpacity="0.08" stroke="#F59E0B" strokeOpacity="0.12" strokeWidth="0.5" />
            {/* Tie */}
            <rect x="80.5" y="60" width="3" height="14" rx="1" fill="white" fillOpacity="0.1" />
            {/* Arms */}
            <ellipse cx="68" cy="70" rx="5" ry="16" fill="#F59E0B" fillOpacity="0.1" transform="rotate(12, 68, 70)" />
            <ellipse cx="96" cy="68" rx="5" ry="18" fill="#F59E0B" fillOpacity="0.08" transform="rotate(-15, 96, 68)" />
            {/* Hands */}
            <circle cx="66" cy="86" r="3.5" fill="#F59E0B" fillOpacity="0.18" />
            <circle cx="98" cy="86" r="3.5" fill="#F59E0B" fillOpacity="0.12" />
          </g>

          {/* Head person 2 */}
          <g filter="url(#shadow3d)">
            <circle cx="82" cy="42" r="13" fill="#F59E0B" fillOpacity="0.2" />
            <circle cx="82" cy="42" r="9" fill="#F59E0B" fillOpacity="0.3" />
            {/* Hair */}
            <path d="M72 38 C72 30 78 28 82 28 C86 30 92 32 92 38" fill="#F59E0B" fillOpacity="0.12" />
            {/* Face */}
            <circle cx="79" cy="41" r="1.2" fill="#F59E0B" fillOpacity="0.25" />
            <circle cx="85" cy="41" r="1.2" fill="#F59E0B" fillOpacity="0.25" />
            <path d="M79 45 C80 47 84 47 85 45" stroke="#F59E0B" strokeOpacity="0.2" strokeWidth="0.8" fill="none" />
          </g>

          {/* Desk / table between them */}
          <rect x="46" y="88" width="28" height="3" rx="1.5" fill="white" fillOpacity="0.08" />
          <rect x="48" y="91" width="3" height="16" rx="1" fill="white" fillOpacity="0.05" />
          <rect x="69" y="91" width="3" height="16" rx="1" fill="white" fillOpacity="0.05" />

          {/* Document on desk */}
          <rect x="52" y="78" width="16" height="12" rx="1.5" fill="white" fillOpacity="0.06" />
          <rect x="55" y="81" width="10" height="1.5" rx="0.75" fill="#F59E0B" fillOpacity="0.12" />
          <rect x="55" y="84.5" width="7" height="1.5" rx="0.75" fill="#F59E0B" fillOpacity="0.08" />
          <path d="M55 89 L58 86.5 L62 88 L66 84" stroke="#F59E0B" strokeOpacity="0.25" strokeWidth="1.2" strokeLinecap="round" />

          {/* Decorative elements */}
          {/* Chart bars on left */}
          <rect x="6" y="108" width="6" height="16" rx="1" fill="white" fillOpacity="0.04" />
          <rect x="14" y="100" width="6" height="24" rx="1" fill="white" fillOpacity="0.06" />
          <rect x="22" y="104" width="6" height="20" rx="1" fill="white" fillOpacity="0.04" />

          {/* Trend line on right */}
          <path d="M100 114 L106 108 L112 111 L118 104" stroke="#10B981" strokeOpacity="0.25" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="118" cy="104" r="2" fill="#10B981" fillOpacity="0.25" />
        </svg>
      </div>
    </div>
  );
}

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
        <div className="relative flex h-16 items-center gap-3 border-b border-white/10 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-500/5 to-transparent" />
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg shadow-accent-500/40">
            <span className="text-sm font-extrabold tracking-tight text-white">
              MB
            </span>
          </div>
          <div className="relative leading-tight">
            <h1 className="text-sm font-bold font-display tracking-tight">
              Importadora
            </h1>
            <p className="text-[11px] font-medium text-white/50">MB</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-white/30">
            Menú
          </p>
          <nav className="space-y-0.5">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-white/10 text-white shadow-sm before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-r before:bg-accent-500 before:shadow-lg before:shadow-accent-500/50"
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

        <div className="mt-auto">
          <HandDrawnLines />
          <AnimatedCharacter />
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          <p className="text-[11px] text-white/30">&copy; {new Date().getFullYear()} Importadora MB</p>
        </div>
      </aside>
    </>
  );
}
