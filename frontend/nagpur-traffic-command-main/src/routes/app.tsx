import { Outlet, createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/layout/Header";
import { NavRail } from "@/components/layout/NavRail";
import { StatusBar } from "@/components/layout/StatusBar";
import { RaastaProvider } from "@/lib/raasta/store";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-6 text-sm text-critical">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-6 text-sm text-muted-foreground">Section not found.</div>,
});

function AppLayout() {
  return (
    <RaastaProvider>
      <div className="flex h-screen min-h-0 flex-col bg-background">
        <Header />
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <NavRail />
          <main className="min-h-0 flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
        <StatusBar />
      </div>
    </RaastaProvider>
  );
}
