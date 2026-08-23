import { createFileRoute, Link } from "@tanstack/react-router";
import { RiMapPin2Line as MapPin } from "@remixicon/react";
import { AppShell } from "@/components/loop/AppShell";
import { useLoop } from "@/lib/loop-store";
import { bucketOf, timeAgo } from "@/lib/loop-data";
import { categoryStyle } from "@/lib/category-icons";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/actividad")({
  head: () => ({
    meta: [
      { title: "Actividad · LOOP" },
      {
        name: "description",
        content: "Timeline de novedades: componentes ofrecidos y buscados por la comunidad maker.",
      },
      { property: "og:title", content: "Actividad · LOOP" },
      { property: "og:description", content: "Novedades del reuso de hardware." },
    ],
  }),
  component: ActividadPage,
});

const ORDER = [
  { bucket: "Hoy", key: "activity.today" },
  { bucket: "Esta semana", key: "activity.week" },
  { bucket: "El mes pasado", key: "activity.month" },
] as const;

function ActividadPage() {
  const { listings } = useLoop();
  const { t } = useI18n();
  const sorted = [...listings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const saved = listings
    .filter((l) => l.intent === "ofrezco")
    .reduce((n, l) => n + l.quantity, 0);

  return (
    <AppShell>
      <div className="space-y-5 p-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("activity.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("activity.subtitle", { n: saved })}</p>
        </div>

        <Link
          to="/proyectos"
          className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 p-4"
        >
          <span>
            <span className="block text-sm font-semibold">{t("activity.bomCard")}</span>
            <span className="block text-xs text-muted-foreground">
              {t("activity.bomCardHint")}
            </span>
          </span>
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
        </Link>

        {ORDER.map(({ bucket, key }) => {
          const items = sorted.filter((l) => bucketOf(l.createdAt) === bucket);
          if (!items.length) return null;
          return (
            <section key={bucket} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(key)}
              </h2>
              {items.map((l) => {
                const { Icon, tile } = categoryStyle(`${l.category} ${l.title}`);
                return (
                  <article
                    key={l.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tile}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{l.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {l.owner} · {timeAgo(l.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          l.intent === "ofrezco"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/15 text-accent"
                        }`}
                      >
                        {l.intent === "ofrezco" ? "Ofrezco" : "Necesito"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {l.intent === "ofrezco"
                        ? `${l.quantity} componente(s) salvados del e-waste`
                        : `Busca ${l.quantity} unidad(es)`}{" "}
                      · {l.zone}
                    </p>
                    <Link
                      to="/"
                      search={{ focus: l.id }}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium"
                    >
                      <MapPin className="h-3.5 w-3.5" /> Ver en el mapa
                    </Link>
                  </article>
                );
              })}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
