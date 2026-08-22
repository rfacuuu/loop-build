import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import { AppShell } from "@/components/loop/AppShell";
import { ListingSheet } from "@/components/loop/ListingDetail";
import { useLoop } from "@/lib/loop-store";
import { categoryStyle } from "@/lib/category-icons";
import type { Listing } from "@/lib/loop-data";

const MapView = lazy(() => import("@/components/loop/MapView"));

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { focus?: string } =>
    typeof s.focus === "string" ? { focus: s.focus } : {},
  head: () => ({
    meta: [
      { title: "LOOP · Mapa maker de hardware reutilizable" },
      {
        name: "description",
        content:
          "Explorá el mapa interactivo de componentes electrónicos ofrecidos y buscados por la comunidad maker.",
      },
      { property: "og:title", content: "LOOP · Mapa maker de hardware reutilizable" },
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
  const { focus } = Route.useSearch();
  const [filter, setFilter] = useState<"todos" | "ofrezco" | "necesito">("todos");
  const [selected, setSelected] = useState<Listing | null>(null);
  const [focused, setFocused] = useState<Listing | null>(null);

  const visible = listings.filter((l) => filter === "todos" || l.intent === filter);

  useEffect(() => {
    if (!focus) return;
    const target = listings.find((l) => l.id === focus);
    if (!target) return;
    setFilter("todos");
    setFocused(target);
    const t = setTimeout(() => setSelected(target), 1200);
    return () => clearTimeout(t);
  }, [focus, listings]);

  return (
    <AppShell>
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mapa</h1>
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

        <div className="relative h-[380px] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
          <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
              <MapView listings={visible} onSelect={setSelected} focus={focused} />
            </Suspense>
          </ClientOnly>
        </div>

        <ul className="space-y-3">
          {visible.map((l) => {
            const { Icon, tile } = categoryStyle(`${l.category} ${l.title}`);
            return (
              <li key={l.id}>
                <button
                  onClick={() => setSelected(l)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-sm"
                >
                  {l.photo ? (
                    <img src={l.photo} alt={l.title} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tile}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                  )}
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
            );
          })}
        </ul>
      </div>
      <ListingSheet listing={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </AppShell>
  );
}
