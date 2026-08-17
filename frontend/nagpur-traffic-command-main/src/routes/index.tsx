import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import mapBg from "@/assets/nagpur-map-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RAASTA — Nagpur Traffic Navigation & Risk Decision Support" },
      {
        name: "description",
        content:
          "Sign in to RAASTA: live Nagpur traffic mapping, congestion risk scoring, routing and police deployment decision support.",
      },
      { property: "og:title", content: "RAASTA — Navigate smarter. Travel safer." },
      {
        property: "og:description",
        content: "Live traffic mapping, risk analysis and deployment guidance for Nagpur, Maharashtra.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const enter = () => void navigate({ to: "/app/overview" });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <img
        src={mapBg}
        alt=""
        aria-hidden
        width={1920}
        height={1280}
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="pointer-events-none absolute inset-0 bg-background/60" aria-hidden />

      <div className="relative w-full max-w-sm border border-border bg-surface lg:mr-[8vw]">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center border border-active/50 bg-active-bg text-[11px] font-semibold text-active">
              R
            </span>
            <h1 className="text-[20px] leading-none font-semibold tracking-[0.16em]">RAASTA</h1>
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground">Navigate smarter. Travel safer.</p>
        </div>

        <form
          className="flex flex-col gap-3 px-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!/.+@.+\..+/.test(email)) {
              setError("Enter a valid email address.");
              return;
            }
            setError(null);
            enter();
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="label-xs text-muted-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@nagpurtraffic.gov.in"
              className="h-9 w-full border border-border bg-background px-2.5 text-[13.5px] text-foreground placeholder:text-subtle focus:border-active focus:outline-none"
            />
          </label>
          {error ? (
            <p className="text-[12px] text-critical" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="h-9 border border-active bg-active text-[12px] font-semibold tracking-[0.08em] text-primary-foreground uppercase transition-colors duration-150 hover:bg-active/85"
          >
            Continue
          </button>

          <div className="my-1 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="label-xs text-subtle">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={enter}
            className="flex h-9 items-center justify-center gap-2 border border-border bg-surface-2 text-[13px] text-foreground transition-colors duration-150 hover:bg-accent"
          >
            <GoogleMark /> Continue with Google
          </button>
          <button
            type="button"
            onClick={enter}
            className="h-9 text-[12.5px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            Continue as guest
          </button>
        </form>

        <p className="border-t border-border px-5 py-3 text-[11px] text-subtle">
          Traffic and risk information for Nagpur, Maharashtra. Sign-in is not connected to a backend in this
          prototype.
        </p>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1a7 7 0 0 1-6.6-4.8H1.4v3.1A11.9 11.9 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.4 14.4a7.1 7.1 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.7l4-3Z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A11.5 11.5 0 0 0 12 0 11.9 11.9 0 0 0 1.4 6.7l4 3.1A7 7 0 0 1 12 4.8Z"
      />
    </svg>
  );
}
