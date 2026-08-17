import { ArrowRight, Navigation, X } from "lucide-react";
import { useState } from "react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { DESTINATIONS } from "@/data/mockData";
import { useRaasta } from "@/lib/raasta/store";
import { cn } from "@/lib/utils";

export function RoutePanel({ className }: { className?: string | undefined }) {
  const { route, routeError, planRoute, clearRoute, userLocation } = useRaasta();
  const [to, setTo] = useState("Nagpur Airport");

  return (
    <section className={cn("border border-border bg-surface", className)}>
      <header className="flex h-9 items-center justify-between border-b border-border px-3">
        <h2 className="label-xs text-muted-foreground">Route</h2>
        {route ? (
          <button
            type="button"
            onClick={clearRoute}
            title="Clear route"
            aria-label="Clear route"
            className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </header>

      <form
        className="flex flex-col gap-2 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          planRoute(to);
        }}
      >
        <Field label="From">
          <input
            value={userLocation.label}
            readOnly
            aria-label="From"
            className="h-8 w-full border border-border bg-background px-2 text-[13px] text-muted-foreground"
          />
        </Field>
        <Field label="To">
          <input
            list="raasta-destinations"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="Destination"
            placeholder="Destination"
            className="h-8 w-full border border-border bg-background px-2 text-[13px] text-foreground placeholder:text-subtle focus:border-active focus:outline-none"
          />
          <datalist id="raasta-destinations">
            {DESTINATIONS.map((d) => (
              <option key={d.label} value={d.label} />
            ))}
          </datalist>
        </Field>
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 border border-active/60 bg-active-bg px-3 py-2 text-[11px] font-semibold tracking-[0.08em] text-active uppercase transition-colors duration-150 hover:bg-active/20"
        >
          <Navigation className="size-3.5" aria-hidden /> Find route
        </button>
      </form>

      {routeError ? (
        <p className="border-t border-border px-3 py-2 text-[12px] text-critical" role="alert">
          {routeError}
        </p>
      ) : null}

      {route ? (
        <div className="border-t border-border p-3">
          <h3 className="label-xs text-muted-foreground">Recommended route</h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-[13px]">
            <span className="text-muted-foreground">{route.from}</span>
            <ArrowRight className="size-3 text-subtle" aria-hidden />
            <span className="font-semibold">{route.to}</span>
          </div>
          <dl className="mt-2.5 grid grid-cols-2 gap-y-1.5 text-[13px]">
            <dt className="text-muted-foreground">Distance</dt>
            <dd className="tabular text-right font-medium">{route.distanceKm} km</dd>
            <dt className="text-muted-foreground">Travel time</dt>
            <dd className="tabular text-right font-medium">{route.durationMin} min</dd>
            <dt className="text-muted-foreground">Traffic</dt>
            <dd className="flex justify-end">
              <StatusBadge level={route.condition} />
            </dd>
          </dl>
          <p className="mt-2 text-[11px] text-subtle">
            Estimated route — sample data, not live routing. {route.note}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="label-xs text-subtle">{label}</span>
      {children}
    </label>
  );
}
