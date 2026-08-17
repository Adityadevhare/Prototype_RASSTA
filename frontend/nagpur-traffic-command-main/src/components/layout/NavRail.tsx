import { Link } from "@tanstack/react-router";
import { BarChart3, Bell, LayoutDashboard, Map } from "lucide-react";

import { useRaasta } from "@/lib/raasta/store";

const items = [
  { to: "/app/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/app/map", label: "Live Map", icon: Map },
  { to: "/app/alerts", label: "Alerts", icon: Bell },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function NavRail() {
  const { risk } = useRaasta();
  const criticalCount = risk.filter((r) => r.risk_level === "CRITICAL" || r.risk_level === "HIGH").length;

  return (
    <nav
      aria-label="Primary"
      className="flex shrink-0 gap-1 border-b border-border bg-surface px-2 py-1.5 md:w-14 md:flex-col md:border-r md:border-b-0 md:px-0 md:py-2"
    >
      {items.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          title={label}
          activeProps={{
            className: "text-active border-active md:border-l-2 md:border-b-0 bg-active-bg/60",
          }}
          inactiveProps={{ className: "text-muted-foreground border-transparent" }}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 border-b-2 px-2 py-2 transition-colors duration-150 hover:text-foreground md:flex-none md:border-l-2 md:border-b-0"
        >
          <Icon className="size-4" aria-hidden />
          <span className="text-[9px] font-semibold tracking-[0.06em] uppercase">{label.split(" ")[0]}</span>
          {label === "Alerts" && criticalCount > 0 ? (
            <span className="absolute top-1.5 right-2 flex size-3.5 items-center justify-center rounded-full bg-critical text-[8px] font-bold text-white md:top-1 md:right-1">
              {criticalCount}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}

