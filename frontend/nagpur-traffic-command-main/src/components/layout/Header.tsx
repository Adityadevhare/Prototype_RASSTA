import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Search, User } from "lucide-react";
import { useState } from "react";

import { DESTINATIONS } from "@/data/mockData";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export function Header() {
  const { risk, focusLocation, planRoute, source } = useRaasta();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim().toLowerCase();
    if (!term) return;
    const match = risk.find((r) => r.location.toLowerCase().includes(term));
    if (match) {
      focusLocation(match.location);
      void navigate({ to: "/app/map" });
      return;
    }
    const dest = DESTINATIONS.find((d) => d.label.toLowerCase().includes(term));
    if (dest) {
      planRoute(dest.label);
      void navigate({ to: "/app/map" });
    }
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-3">
      <Link to="/app/map" className="flex items-center gap-2 pr-1">
        <span className="flex size-6 items-center justify-center border border-active/50 bg-active-bg text-[11px] font-semibold text-active">
          R
        </span>
        <span className="text-[19px] leading-none font-semibold tracking-[0.14em]">RAASTA</span>
      </Link>

      <form onSubmit={onSubmit} className="mx-auto hidden w-full max-w-md items-center md:flex">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search location or destination"
            placeholder="Search location or destination..."
            className="h-8 w-full border border-border bg-background pr-2 pl-8 text-[13px] text-foreground placeholder:text-subtle focus:border-active focus:outline-none"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-3">
        <span
          className="label-xs flex items-center gap-1.5 border border-border px-1.5 py-1 text-muted-foreground"
          title={source === "live" ? "Connected to RAASTA backend" : "Backend offline — showing sample data"}
        >
          <span
            className={cn("size-1.5 rounded-full", source === "live" ? "bg-normal live-dot" : "bg-subtle")}
            aria-hidden
          />
          {source === "live" ? "LIVE" : "SAMPLE"}
        </span>
        <button
          type="button"
          title="Notifications"
          aria-label="Notifications"
          onClick={() => void navigate({ to: "/app/alerts" })}
          className="relative text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          <Bell className="size-4" aria-hidden />
          <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-critical" aria-hidden />
        </button>
        <div className="relative">
          <button
            type="button"
            aria-label="User menu"
            title="Operator menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex size-7 items-center justify-center border border-border bg-surface-2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <User className="size-3.5" aria-hidden />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 z-50 mt-1 w-48 border border-border bg-popover p-1 text-[13px]">
              <div className="px-2 py-1.5">
                <div className="font-medium">Operator</div>
                <div className="text-[11px] text-subtle">Nagpur Traffic Cell</div>
              </div>
              <div className="my-1 h-px bg-border" />
              <Link
                to="/"
                className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
              >
                <LogOut className="size-3.5" aria-hidden /> Sign out
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
