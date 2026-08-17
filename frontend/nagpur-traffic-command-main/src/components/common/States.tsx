import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading traffic data…", className }: { label?: string | undefined; className?: string | undefined }) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-6 text-xs text-muted-foreground", className)}>
      <Loader2 className="size-3.5 animate-spin" aria-hidden />
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
    <div className={cn("flex flex-col gap-2 px-3 py-6", className)} role="alert">
      <div className="flex items-center gap-2 text-xs text-critical">
        <AlertTriangle className="size-3.5" aria-hidden />
        <span>{message}</span>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="w-fit border border-border px-2 py-1 text-xs text-foreground transition-colors duration-150 hover:bg-accent"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  message = "No traffic data available.",
  className,
}: {
  message?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-6 text-xs text-subtle", className)}>
      <Inbox className="size-3.5" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
