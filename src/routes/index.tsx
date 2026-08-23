import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import { RiShieldCheckLine } from "@remixicon/react";
import { AppShell } from "@/components/loop/AppShell";
import { ListingSheet } from "@/components/loop/ListingDetail";
import { useLoop } from "@/lib/loop-store";
import { categoryStyle } from "@/lib/category-icons";
import {
  CATEGORY_GROUPS,
  MAP_CENTER,
  distanceKm,
  inCategoryGroup,
  isVerified,
  type Listing,
} from "@/lib/loop-data";
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
  const [selected, setSelected] = useState<Listing | null>(null);
  const [focused, setFocused] = useState<Listing | null>(null);

  const project = bom ? SEED_PROJECTS.find((p) => p.id === bom) : undefined;
  const missing = project ? bomProgress(project, listings).missing : [];
  const maxKm = RADII.find((r) => r.id === radius)?.km ?? Infinity;

  const visible = listings.filter((l) => {
    if (filter !== "todos" && l.intent !== filter) return false;
    if (category && !inCategoryGroup(l, category)) return false;
    if (onlyVerified && !isVerified(l)) return false;
    if (Number.isFinite(maxKm) && distanceKm(MAP_CENTER, [l.lat, l.lng]) > maxKm) return false;
    if (project && !missing.some((item) => matchesBom(l, item))) return false;
    return true;
  });

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

        <div className="space-y-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
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

          <div className="flex flex-wrap gap-2">
            {CATEGORY_GROUPS.map((g) => {
              const active = category === g.id;
              const { Icon } = categoryStyle(g.label);
              return (
                <button
                  key={g.id}
                  onClick={() => setCategory(active ? null : g.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {g.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setOnlyVerified((v) => !v)}
            aria-pressed={onlyVerified}
            className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-xs font-medium"
          >
            <span className="inline-flex items-center gap-1.5">
              <RiShieldCheckLine className="h-4 w-4 text-primary" /> Solo verificados en Nodo
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
