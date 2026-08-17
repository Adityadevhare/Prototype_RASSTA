import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Bell, Clock, LogOut, Radio, Search, ShieldAlert, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DESTINATIONS } from "@/data/mockData";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export function Header() {
  const { risk, focusLocation, planRoute, source } = useRaasta();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const criticalCount = risk.filter((r) => r.risk_level === "CRITICAL" || r.risk_level === "HIGH").length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

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
    <header className="flex h-13 shrink-0 items-center justify-between border-b border-border bg-surface px-3 py-1">
      {/* Brand & Sector Subtitle */}
      <div className="flex items-center gap-3">
        <Link to="/app/overview" className="flex items-center gap-2.5 group">
          <div className="relative flex size-7 items-center justify-center border border-active/70 bg-gradient-to-b from-active/30 to-active/10 text-[12px] font-bold text-active shadow-xs">
            R
            <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-active animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold tracking-[0.18em] leading-none text-foreground flex items-center gap-1.5">
              RAASTA
              <span className="text-[9px] font-semibold uppercase tracking-wider text-active border border-active/40 bg-active-bg/60 px-1 py-0.2 rounded-xs">
                OPS
              </span>
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
              Nagpur Traffic Intelligence & Deployment
            </span>
          </div>
        </Link>
      </div>

      {/* Global Command Center Search */}
      <form onSubmit={onSubmit} className="mx-4 hidden max-w-md flex-1 items-center md:flex">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle" aria-hidden />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search sector or destination"
            placeholder="Search sector, corridor, or destination...  (Ctrl+K)"
            className="h-8 w-full border border-border bg-background/80 pr-2 pl-8 text-[12.5px] text-foreground placeholder:text-subtle/80 focus:border-active focus:bg-background focus:outline-none transition-all"
          />
        </div>
      </form>

      {/* Realtime Telemetry, Alert Counter, Time, and Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Live Clock */}
        <div className="hidden lg:flex items-center gap-1.5 border border-border/80 bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground tabular">
          <Clock className="size-3 text-subtle" aria-hidden />
          <span className="font-mono text-foreground">{timeStr || "--:--:-- IST"}</span>
        </div>

        {/* Data Link State */}
        <span
          className={cn(
            "label-xs flex items-center gap-1.5 border px-2 py-1 transition-colors",
            source === "live"
              ? "border-normal/40 bg-normal-bg/40 text-normal"
              : "border-moderate/40 bg-moderate-bg/40 text-moderate"
          )}
          title={source === "live" ? "Connected to RAASTA Backend Engine (FastAPI)" : "Backend offline — running autonomous simulated telemetry"}
        >
          <Radio className={cn("size-3", source === "live" ? "animate-pulse text-normal" : "text-moderate")} />
          <span className="font-semibold">{source === "live" ? "LIVE FEED" : "FALLBACK"}</span>
        </span>

        {/* Tactical Alert Icon Button */}
        <button
          type="button"
          title="Active Alerts"
          aria-label="Active Alerts"
          onClick={() => void navigate({ to: "/app/alerts" })}
          className={cn(
            "relative flex size-7 items-center justify-center border transition-colors duration-150",
            criticalCount > 0
              ? "border-critical/50 bg-critical-bg/40 text-critical hover:bg-critical-bg"
              : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell className="size-3.5" aria-hidden />
          {criticalCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-critical text-[8px] font-bold text-white shadow-xs">
              {criticalCount}
            </span>
          ) : null}
        </button>

        {/* Operator Profile Control */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Operator Menu"
            title="Operator Menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 border border-border bg-surface-2 px-2 py-1 text-muted-foreground transition-colors duration-150 hover:border-border-strong hover:text-foreground"
          >
            <User className="size-3.5 text-active" aria-hidden />
            <span className="hidden sm:inline text-[11.5px] font-medium text-foreground">Control-01</span>
          </button>
          {menuOpen ? (
            <div className="absolute right-0 z-50 mt-1 w-52 border border-border bg-popover p-1.5 text-[12.5px] shadow-xl">
              <div className="px-2 py-1.5">
                <div className="font-semibold text-foreground">Duty Officer</div>
                <div className="text-[10.5px] text-muted-foreground">Nagpur Police Traffic HQ</div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-normal font-mono">
                  <Activity className="size-2.5" /> Shift Active (Sector A)
                </div>
              </div>
              <div className="my-1 h-px bg-border" />
              <Link
                to="/"
                className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
              >
                <LogOut className="size-3.5" aria-hidden /> Sign Out
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

