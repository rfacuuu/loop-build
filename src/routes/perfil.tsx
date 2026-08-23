import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  RiVerifiedBadgeFill as BadgeCheck,
  RiStarFill as Star,
  RiDeleteBin6Line as Trash2,
  RiRecycleLine,
  RiCloudyLine,
  RiHandCoinLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { AppShell } from "@/components/loop/AppShell";
import { ListingSheet } from "@/components/loop/ListingDetail";
import { useLoop } from "@/lib/loop-store";
import { timeAgo, type Listing } from "@/lib/loop-data";
import { categoryStyle } from "@/lib/category-icons";
import { impactOf, formatArs } from "@/lib/loop-impact";
import { MAKER_SCORE, SEED_REVIEWS, trustBadges } from "@/lib/loop-reputation";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil, impacto y Maker Score · LOOP" },
      {
        name: "description",
        content:
          "Tu Maker Score, badges de confianza, impacto circular y publicaciones activas en LOOP.",
      },
      { property: "og:title", content: "Perfil, impacto y Maker Score · LOOP" },
      { property: "og:description", content: "Reputación verificada e impacto ambiental medible." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { user, listings, removeListing } = useLoop();
  const [tab, setTab] = useState<"necesito" | "ofrezco" | "reviews">("ofrezco");
  const [selected, setSelected] = useState<Listing | null>(null);
  const mine = listings.filter((l) => l.intent === tab);
  const impact = impactOf(listings);
  const badges = trustBadges(impact.pieces);

  return (
    <AppShell>
      <div className="space-y-5 p-4">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {user?.initials}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-lg font-bold">
              {user?.name}
              <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-accent text-accent" /> {MAKER_SCORE.rating}
              <span className="font-normal text-muted-foreground">
                · {MAKER_SCORE.exchanges} intercambios
              </span>
            </p>
          </div>
        </div>

        <section className="space-y-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <div>
            <h2 className="flex items-center gap-2 font-bold">
              <RiRecycleLine className="h-5 w-5 text-primary" /> Impacto Circular
            </h2>
            <p className="text-xs text-muted-foreground">
              Calculado sobre tus publicaciones e intercambios completados.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Metric
              Icon={RiRecycleLine}
              value={`${impact.ewasteKg} kg`}
              label="E-waste evitado"
            />
            <Metric Icon={RiCloudyLine} value={`${impact.co2Kg} kg`} label="CO₂ compensado" />
            <Metric
              Icon={RiHandCoinLine}
              value={formatArs(impact.savingsArs)}
              label="Ahorro comunitario"
            />
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Maker Score · Badges de confianza
          </h2>
          <div className="space-y-2">
            {badges.map(({ id, label, description, Icon, className }) => (
              <div
                key={id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${className}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            [String(MAKER_SCORE.exchanges), "Entregas"],
            [String(MAKER_SCORE.rating), "Rating"],
            [String(impact.pieces), "Piezas reusadas"],
          ].map(([v, k]) => (
            <div key={k} className="rounded-2xl border border-border bg-card p-3 shadow-sm">
              <p className="text-lg font-bold">{v}</p>
              <p className="text-[11px] text-muted-foreground">{k}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
          {(["necesito", "ofrezco", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full py-2 text-xs font-medium transition-colors ${
                tab === t ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t === "necesito" ? "Necesito" : t === "ofrezco" ? "Ofrezco" : "Reviews"}
            </button>
          ))}
        </div>

        {tab === "reviews" ? (
          <ul className="space-y-3">
            {SEED_REVIEWS.map((r) => (
              <li key={r.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold">
                    {r.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.author}</p>
                    <p className="text-[11px] text-muted-foreground">{r.when}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {r.rating}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3">
            {mine.map((l) => {
              const { Icon, tile } = categoryStyle(`${l.category} ${l.title}`);
              return (
                <li
                  key={l.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm"
                >
                  <button
                    onClick={() => setSelected(l)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    {l.photo ? (
                      <img src={l.photo} alt={l.title} className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tile}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{l.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {l.status} · {timeAgo(l.createdAt)}
                      </span>
                    </span>
                  </button>
                  <button
                    aria-label="Eliminar"
                    onClick={() => removeListing(l.id)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <ListingSheet listing={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </AppShell>
  );
}

function Metric({
  Icon,
  value,
  label,
}: {
  Icon: RemixiconComponentType;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-background/80 p-3 text-center shadow-sm">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-sm font-bold leading-tight">{value}</p>
      <p className="text-[10px] leading-tight text-muted-foreground">{label}</p>
    </div>
  );
}
