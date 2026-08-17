import { ArrowRight, Clock, Compass, Loader2, MapPin, Navigation, Radio, Route as RouteIcon, Shield, ShieldAlert, X } from "lucide-react";
import { useState } from "react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { DESTINATIONS } from "@/data/mockData";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export function RoutePanel({ className }: { className?: string | undefined }) {
  const { route, routeError, isRouting, planRoute, clearRoute, userLocation } = useRaasta();
  const [to, setTo] = useState("Nagpur Airport");

  return (
    <section className={cn("flex flex-col border border-border bg-surface shadow-xs", className)}>
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-border bg-surface-2 px-3">
        <div className="flex items-center gap-1.5">
          <Compass className="size-3.5 text-active" />
          <h2 className="label-xs text-foreground font-mono tracking-wider">Strategic Corridor Planner</h2>
        </div>
        {route ? (
          <button
            type="button"
            onClick={clearRoute}
            title="Clear active route"
            aria-label="Clear active route"
            className="text-muted-foreground transition-colors duration-150 hover:text-foreground p-0.5"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </header>

      <form
        className="flex flex-col gap-2.5 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void planRoute(to);
        }}
      >
        <Field label="ORIGIN BASE">
          <div className="relative">
            <MapPin className="absolute top-1/2 left-2 size-3 -translate-y-1/2 text-normal" />
            <input
              value={userLocation.label + " (Ramdaspeth HQ)"}
              readOnly
              aria-label="Origin Base"
              className="h-8 w-full border border-border bg-background/60 pr-2 pl-7 font-mono text-[12px] text-muted-foreground"
            />
          </div>
        </Field>

        <Field label="TARGET DESTINATION">
          <div className="relative">
            <Navigation className="absolute top-1/2 left-2 size-3 -translate-y-1/2 text-active" />
            <input
              list="raasta-destinations"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="Target Destination"
              placeholder="Select or enter Nagpur destination…"
              className="h-8 w-full border border-border bg-background pr-2 pl-7 text-[12.5px] text-foreground placeholder:text-subtle focus:border-active focus:outline-none font-medium transition-colors"
            />
          </div>
          <datalist id="raasta-destinations">
            {DESTINATIONS.map((d) => (
              <option key={d.label} value={d.label}>
                {d.description}
              </option>
            ))}
          </datalist>
        </Field>

        {/* Quick Corridor Selection Chips */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {DESTINATIONS.slice(0, 4).map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => {
                setTo(d.label);
                void planRoute(d.label);
              }}
              className={cn(
                "text-[10px] px-2 py-0.5 border transition-all truncate max-w-28",
                to === d.label
                  ? "border-active bg-active-bg text-active font-semibold"
                  : "border-border/80 bg-surface-2 text-muted-foreground hover:border-border-strong hover:text-foreground"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isRouting}
          className="flex items-center justify-center gap-1.5 border border-active/70 bg-gradient-to-r from-active/90 to-active py-2 text-[11px] font-bold tracking-wider text-primary-foreground uppercase shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 mt-1"
        >
          {isRouting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              <span>Querying OpenRouteService…</span>
            </>
          ) : (
            <>
              <Navigation className="size-3.5" aria-hidden />
              <span>Calculate Strategic Route</span>
            </>
          )}
        </button>
      </form>

      {routeError ? (
        <div className="flex items-center gap-1.5 border-t border-critical/40 bg-critical-bg/30 px-3 py-2 text-[11.5px] text-critical" role="alert">
          <ShieldAlert className="size-3.5 shrink-0" />
          <span>{routeError}</span>
        </div>
      ) : null}

      {route ? (
        <div className="border-t border-border bg-surface-2/30 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "label-xs font-mono px-1.5 py-0.2 border text-[9px] font-bold",
                  route.source === "live"
                    ? "border-normal/40 bg-normal-bg/60 text-normal"
                    : "border-border bg-surface-2 text-muted-foreground"
                )}
              >
                {route.source === "live" ? "LIVE ORS ROUTE" : "SAMPLE CORRIDOR"}
              </span>
            </div>
            <StatusBadge level={route.condition} />
          </div>

          <div className="flex items-center gap-2 rounded-xs border border-border/80 bg-background/80 px-2.5 py-1.5 text-[12px]">
            <span className="font-semibold text-normal font-mono text-[11px]">HQ Base</span>
            <ArrowRight className="size-3 text-subtle" aria-hidden />
            <span className="font-bold text-foreground truncate">{route.to}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px] tabular">
            <div className="border border-border/60 bg-background/60 p-2">
              <span className="text-[10px] text-muted-foreground block font-mono">DRIVING DISTANCE</span>
              <span className="font-mono text-[16px] font-bold text-foreground">{route.distanceKm} km</span>
            </div>
            <div className="border border-border/60 bg-background/60 p-2">
              <span className="text-[10px] text-muted-foreground block font-mono">EST. TRAVEL TIME</span>
              <span className="font-mono text-[16px] font-bold text-active">{route.durationMin} mins</span>
            </div>
          </div>

          <p className="text-[10.5px] text-muted-foreground border-l-2 border-border pl-2 leading-relaxed">
            {route.note}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="label-xs text-muted-foreground font-mono">{label}</span>
      {children}
    </label>
  );
}
