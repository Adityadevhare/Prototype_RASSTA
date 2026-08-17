import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading traffic data…", className }: { label?: string | undefined; className?: string | undefined }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 px-3 py-10 text-xs text-muted-foreground", className)}>
      <Loader2 className="size-5 animate-spin text-active" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({
  message = "Unable to load traffic data.",
  onRetry,
  className,
}: {
  message?: string | undefined;
  onRetry?: (() => void) | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-3 py-10", className)} role="alert">
      <div className="flex items-center gap-2 text-xs text-critical">
        <AlertTriangle className="size-4" aria-hidden />
        <span>{message}</span>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 border border-border px-3 py-1.5 text-xs text-foreground transition-colors duration-150 hover:bg-accent"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  message = "No traffic data available.",
  hint = "Data will appear when backend is connected or areas are being monitored.",
  className,
}: {
  message?: string | undefined;
  hint?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-1.5 px-3 py-10 text-center", className)}>
      <Inbox className="size-5 text-subtle" aria-hidden />
      <span className="text-xs text-subtle">{message}</span>
      <span className="max-w-52 text-[11px] text-subtle/70">{hint}</span>
    </div>
  );
}
