import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import {
  RiCloseLine,
  RiEqualizerLine,
  RiExpandDiagonalLine,
  RiCollapseDiagonalLine,
  RiSearchLine,
  RiShieldCheckLine,
} from "@remixicon/react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AppShell } from "@/components/loop/AppShell";
import { ListingSheet } from "@/components/loop/ListingDetail";
import { useLoop } from "@/lib/loop-store";
import { categoryStyle } from "@/lib/category-icons";
import { MAP_CENTER, distanceKm, isVerified, type Listing } from "@/lib/loop-data";
import { SEED_PROJECTS, bomProgress, matchesBom } from "@/lib/loop-projects";

const MapView = lazy(() => import("@/components/loop/MapView"));

const RADII = [
  { id: "todos", label: "Todos", km: Infinity },
  { id: "5", label: "< 5 km", km: 5 },
  { id: "15", label: "< 15 km", km: 15 },
] as const;

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { focus?: string; bom?: string } => ({
    ...(typeof s["focus"] === "string" ? { focus: s["focus"] } : {}),
    ...(typeof s["bom"] === "string" ? { bom: s["bom"] } : {}),
  }),
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
  const { focus, bom } = Route.useSearch();
  const [filter, setFilter] = useState<"todos" | "ofrezco" | "necesito">("todos");
  const [radius, setRadius] = useState<(typeof RADII)[number]["id"]>("todos");
  const [category, setCategory] = useState<string | null>(null);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapFull, setMapFull] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [focused, setFocused] = useState<Listing | null>(null);

  const project = bom ? SEED_PROJECTS.find((p) => p.id === bom) : undefined;
  const missing = project ? bomProgress(project, listings).missing : [];
  const maxKm = RADII.find((r) => r.id === radius)?.km ?? Infinity;

  /** Categorías/tags únicas realmente presentes en las publicaciones. */
  const dynamicTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of listings) {
      for (const label of [l.category, ...l.tags]) {
        const key = label.trim();
        if (key.length < 3) continue;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([label]) => label);
  }, [listings]);

  const q = query.trim().toLowerCase();
  const visible = listings.filter((l) => {
    if (filter !== "todos" && l.intent !== filter) return false;
    if (category) {
      const haystack = `${l.category} ${l.tags.join(" ")} ${l.title}`.toLowerCase();
      if (!haystack.includes(category.toLowerCase())) return false;
    }
    if (q) {
      const hay = `${l.title} ${l.category} ${l.zone} ${l.tags.join(" ")} ${l.owner}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (onlyVerified && !isVerified(l)) return false;
    if (Number.isFinite(maxKm) && distanceKm(MAP_CENTER, [l.lat, l.lng]) > maxKm) return false;
    if (project) {
      if (l.intent !== "ofrezco") return false;
      if (!missing.some((item) => matchesBom(l, item))) return false;
    }
    return true;
  });

  const activeCount =
    (filter !== "todos" ? 1 : 0) + (radius !== "todos" ? 1 : 0) + (onlyVerified ? 1 : 0);

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
      <div className="space-y-3 p-4">
        {!mapFull ? (
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mapa</h1>
            <p className="text-sm text-muted-foreground">
              Ubicaciones aproximadas por privacidad · {visible.length} publicaciones activas
            </p>
          </div>
        ) : null}

        {project ? (
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-3 text-sm">
            <p className="font-semibold">Faltantes de {project.name}</p>
            <p className="text-xs text-muted-foreground">
              {missing.length
                ? missing.map((m) => m.name).join(" · ")
                : "¡Ya conseguiste todas las piezas!"}
            </p>
          </div>
        ) : null}

        {/* Barra compacta: buscador + botón de filtros */}
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-sm">
            <RiSearchLine className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar componente, zona o maker"
              aria-label="Buscar publicaciones"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query ? (
              <button type="button" aria-label="Limpiar búsqueda" onClick={() => setQuery("")}>
                <RiCloseLine className="h-4 w-4 text-muted-foreground" />
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="relative inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm"
          >
            <RiEqualizerLine className="h-4 w-4" /> Filtros
            {activeCount ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            ) : null}
          </button>
        </div>

        {/* Tags dinámicas en una sola línea con scroll horizontal */}
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto scroll-smooth px-1 pb-1">
          {category ? (
            <button
              onClick={() => setCategory(null)}
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              <RiCloseLine className="h-3.5 w-3.5" /> {category}
            </button>
          ) : null}
          {dynamicTags
            .filter((t) => t !== category)
            .map((t) => {
              const { Icon } = categoryStyle(t);
              return (
                <button
                  key={t}
                  onClick={() => setCategory(t)}
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5" /> {t}
                </button>
              );
            })}
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-[height] duration-300 ${
            mapFull ? "h-[calc(100vh-13rem)]" : "h-[380px]"
          }`}
        >
          <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
              <MapView listings={visible} onSelect={setSelected} focus={focused} />
            </Suspense>
          </ClientOnly>
          <button
            type="button"
            onClick={() => setMapFull((v) => !v)}
            aria-label={mapFull ? "Reducir mapa" : "Ampliar mapa"}
            className="absolute right-3 top-3 z-[5] grid h-9 w-9 place-items-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur"
          >
            {mapFull ? (
              <RiCollapseDiagonalLine className="h-4 w-4" />
            ) : (
              <RiExpandDiagonalLine className="h-4 w-4" />
            )}
          </button>
        </div>

        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetContent side="bottom" className="mx-auto max-w-md rounded-t-3xl">
            <SheetTitle className="text-left text-lg">Filtros</SheetTitle>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Intención</p>
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
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Distancia</p>
                <div className="flex flex-wrap gap-2">
                  {RADII.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRadius(r.id)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        radius === r.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setOnlyVerified((v) => !v)}
                aria-pressed={onlyVerified}
                className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-xs font-medium"
              >
                <span className="inline-flex items-center gap-1.5">
                  <RiShieldCheckLine className="h-4 w-4 text-primary" /> Solo verificados en Punto LOOP
                </span>
                <span
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    onlyVerified ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all ${
                      onlyVerified ? "left-[1.15rem]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilter("todos");
                    setRadius("todos");
                    setOnlyVerified(false);
                    setCategory(null);
                  }}
                  className="flex-1 rounded-full border border-border py-2 text-sm font-medium text-muted-foreground"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="flex-1 rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground"
                >
                  Ver {visible.length} resultados
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>


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
                    <span className="flex items-center gap-1.5 truncate font-semibold">
                      {l.title}
                      {isVerified(l) ? <RiShieldCheckLine className="h-3.5 w-3.5 shrink-0 text-primary" /> : null}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {l.category} · {l.zone} · {distanceKm(MAP_CENTER, [l.lat, l.lng]).toFixed(1)} km
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
