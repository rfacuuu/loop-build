import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/loop/AppShell";
import { useLoop } from "@/lib/loop-store";
import { bucketOf, timeAgo } from "@/lib/loop-data";

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

const ORDER = ["Hoy", "Esta semana", "El mes pasado"] as const;

function ActividadPage() {
  const { listings } = useLoop();
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
          <h1 className="text-2xl font-bold tracking-tight">Actividad</h1>
          <p className="text-sm text-muted-foreground">
            {saved} componentes rescatados de la basura electrónica.
          </p>
        </div>

        {ORDER.map((bucket) => {
          const items = sorted.filter((l) => bucketOf(l.createdAt) === bucket);
          if (!items.length) return null;
          return (
            <section key={bucket} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {bucket}
              </h2>
              {items.map((l) => (
                <article
                  key={l.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl ${
                        l.intent === "ofrezco" ? "bg-primary/10" : "bg-accent/15"
                      }`}
                    >
                      {l.emoji}
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
                    className="mt-3 inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-medium"
                  >
                    Ver en el mapa
                  </Link>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
