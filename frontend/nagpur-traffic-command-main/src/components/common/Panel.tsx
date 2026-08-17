import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({
  title,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string | undefined;
  actions?: ReactNode | undefined;
  children: ReactNode;
  className?: string | undefined;
  bodyClassName?: string | undefined;
}) {
  return (
    <section className={cn("flex min-h-0 flex-col border border-border bg-surface", className)}>
      {title ? (
        <header className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
          <h2 className="label-xs text-muted-foreground">{title}</h2>
          {actions}
        </header>
      ) : null}
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}
