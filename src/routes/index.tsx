import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/loop/AppShell";
import { ListingSheet } from "@/components/loop/ListingDetail";
import { useLoop } from "@/lib/loop-store";
import type { Listing } from "@/lib/loop-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOOP · Mapa maker de hardware en Salta" },
      {
        name: "description",
        content:
          "Explorá el mapa de componentes electrónicos ofrecidos y buscados por makers de Salta Capital.",
      },
      { property: "og:title", content: "LOOP · Mapa maker de hardware en Salta" },
      {
        property: "og:description",
        content: "Build. Learn. Reuse. Repeat. Mantené la tecnología en movimiento.",
      },
    ],
  }),
  component: MapaPage,
});

function MapaPage() {
  const { listings } = useLoop();
  const [filter, setFilter] = useState<"todos" | "ofrezco" | "necesito">("todos");
  const [selected, setSelected] = useState<Listing | null>(null);

  const visible = listings.filter((l) => filter === "todos" || l.intent === filter);

  return (
    <AppShell>
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mapa de Salta</h1>
          <p className="text-sm text-muted-foreground">
            Ubicaciones aproximadas por privacidad · {visible.length} publicaciones activas
          </p>
        </div>

        <div className="flex gap-2">
          {(["todos", "ofrezco", "necesito"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                filter === f
                  ? f === "necesito"
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative h-[380px] overflow-hidden rounded-2xl border border-border bg-[oklch(0.95_0.02_150)] shadow-sm">
          <MapBackdrop />
          {visible.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelected(l)}
              aria-label={l.title}
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span
                className={`block h-4 w-4 rounded-full ring-4 ${
                  l.intent === "ofrezco"
                    ? "bg-primary ring-primary/25"
                    : "bg-accent ring-accent/25"
                }`}
              />
            </button>
          ))}
          <span className="absolute bottom-2 left-3 rounded-full bg-background/80 px-2 py-1 text-[10px] text-muted-foreground">
            Salta Capital · microcentro, UNSa, E.E.T. N°3100
          </span>
        </div>

        <ul className="space-y-3">
          {visible.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => setSelected(l)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-sm"
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl ${
                    l.intent === "ofrezco" ? "bg-primary/10" : "bg-accent/15"
                  }`}
                >
                  {l.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{l.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {l.category} · {l.zone}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    l.intent === "ofrezco"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  {l.intent === "ofrezco" ? "Ofrezco" : "Necesito"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ListingSheet listing={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </AppShell>
  );
}

function MapBackdrop() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <rect width="100" height="100" fill="oklch(0.96 0.015 140)" />
      <path d="M0 70 L100 55 L100 100 L0 100 Z" fill="oklch(0.93 0.03 150)" />
      <path d="M0 30 L100 22" stroke="oklch(0.99 0 0)" strokeWidth="3" />
      <path d="M0 52 L100 45" stroke="oklch(0.99 0 0)" strokeWidth="4" />
      <path d="M0 78 L100 70" stroke="oklch(0.99 0 0)" strokeWidth="3" />
      <path d="M22 0 L28 100" stroke="oklch(0.99 0 0)" strokeWidth="3" />
      <path d="M52 0 L56 100" stroke="oklch(0.99 0 0)" strokeWidth="4" />
      <path d="M80 0 L84 100" stroke="oklch(0.99 0 0)" strokeWidth="3" />
      <rect x="58" y="24" width="14" height="12" fill="oklch(0.9 0.05 150)" />
      <rect x="10" y="58" width="12" height="10" fill="oklch(0.9 0.05 150)" />
    </svg>
  );
}
