import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Bell, Clock, LogOut, Moon, Radio, Search, ShieldAlert, Sun, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DESTINATIONS } from "@/data/mockData";
import type { SearchedLocation } from "@/lib/raasta/store";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

/**
 * Local aliases for known locations (e.g., common names in local language)
 */
const LOCATION_ALIASES: Record<string, string> = {
  "bardi": "Sitabuldi", // Local alias for Sitabuldi sector
};

/**
 * Improved location search matching strategy:
 * 1. Check aliases first
 * 2. Exact match (normalized case)
 * 3. Starts-with match
 * 4. Contains match
 * Returns the best match or null
 */
function findBestLocationMatch<T extends { label?: string; location?: string }>(
  term: string,
  locations: T[]
): T | null {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return null;

  // Stage 0: Check aliases
  if (normalized in LOCATION_ALIASES) {
    const aliasTarget = LOCATION_ALIASES[normalized];
    const aliasMatch = locations.find(
      (l) => (l.location || l.label || "").toLowerCase() === aliasTarget.toLowerCase()
    );
    if (aliasMatch) return aliasMatch;
  }

  // Stage 1: Exact match
  const exact = locations.find(
    (l) => (l.location || l.label || "").toLowerCase() === normalized
  );
  if (exact) return exact;

  // Stage 2: Starts-with match (prioritizes word-start matches)
  const startsWith = locations.filter((l) =>
    (l.location || l.label || "").toLowerCase().startsWith(normalized)
  );
  if (startsWith.length === 1) return startsWith[0];
  if (startsWith.length > 1) {
    // Return shortest match (most specific)
    return startsWith.reduce((best, current) =>
      (current.location || current.label || "").length <
      (best.location || best.label || "").length
        ? current
        : best
    );
  }

  // Stage 3: Contains match (substring anywhere)
  const contains = locations.filter((l) =>
    (l.location || l.label || "").toLowerCase().includes(normalized)
  );
  if (contains.length === 1) return contains[0];
  if (contains.length > 1) {
    // Return shortest match (most specific)
    return contains.reduce((best, current) =>
      (current.location || current.label || "").length <
      (best.location || best.label || "").length
        ? current
        : best
    );
  }

  return null;
}

export function Header() {
  const { risk, focusLocation, planRoute, source, setSearchedLocation } = useRaasta();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Initialize theme from localStorage and sync with DOM
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("raasta-theme") : null;
    let isDarkMode = true;

    if (stored === "light") {
      isDarkMode = false;
    } else if (stored === null) {
      // Detect system preference if no user preference saved
      isDarkMode = !window.matchMedia("(prefers-color-scheme: light)").matches;
    }

    setIsDark(isDarkMode);
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.remove("light");
    } else {
      html.classList.add("light");
    }
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

    setGeocodeError(null);

    // Stage 1: Try to find in existing RAASTA monitored sectors
    // Uses improved fuzzy matching: exact → starts-with → contains
    const riskMatch = findBestLocationMatch(term, risk);
    if (riskMatch) {
      focusLocation(riskMatch.location);
      setSearchedLocation(null);
      setQuery("");
      void navigate({ to: "/app/map" });
      return;
    }

    // Stage 2: Try to find in destination routes
    const destMatch = findBestLocationMatch(term, DESTINATIONS);
    if (destMatch) {
      planRoute(destMatch.label);
      setSearchedLocation(null);
      setQuery("");
      void navigate({ to: "/app/map" });
      return;
    }

    // Stage 3: Fall back to geocoding for other Nagpur locations
    geocodeLocation(term);
  };

  const geocodeLocation = async (locationName: string) => {
    setIsGeocoding(true);
    setGeocodeError(null);

    try {
      // Use Nominatim (OpenStreetMap) for free geocoding
      // Search focused on Nagpur, Maharashtra, India
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationName + ", Nagpur, Maharashtra, India"
        )}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "RAASTA-Nagpur-App/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const results = await response.json();

      if (!Array.isArray(results) || results.length === 0) {
        setGeocodeError(`Location "${locationName}" not found`);
        // Clear error after 4 seconds
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => setGeocodeError(null), 4000);
        setIsGeocoding(false);
        return;
      }

      const result = results[0];
      const searchedLoc: SearchedLocation = {
        name: result.display_name?.split(",")[0] || locationName,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };

      setSearchedLocation(searchedLoc);
      setQuery("");
      void navigate({ to: "/app/map" });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to geocode location";
      setGeocodeError(errorMsg);
      // Clear error after 4 seconds
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => setGeocodeError(null), 4000);
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      html.classList.remove("light");
      localStorage.setItem("raasta-theme", "dark");
    } else {
      html.classList.add("light");
      localStorage.setItem("raasta-theme", "light");
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
            disabled={isGeocoding}
            aria-label="Search sector or destination"
            placeholder="Search sector, corridor, or destination...  (Ctrl+K)"
            className={cn(
              "h-8 w-full border border-border bg-background/80 pr-2 pl-8 text-[12.5px] text-foreground placeholder:text-subtle/80 focus:border-active focus:bg-background focus:outline-none transition-all",
              geocodeError && "border-critical/60 focus:border-critical"
            )}
          />
          {isGeocoding && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
              searching...
            </span>
          )}
          {geocodeError && !isGeocoding && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-critical font-semibold">
              ✗ {geocodeError}
            </span>
          )}
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

        {/* Theme Toggle */}
        <button
          type="button"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="flex size-7 items-center justify-center border border-border bg-surface-2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          {isDark ? <Sun className="size-3.5" aria-hidden /> : <Moon className="size-3.5" aria-hidden />}
        </button>

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

