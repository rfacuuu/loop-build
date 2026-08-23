import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { RiAddLine, RiCheckLine, RiMapPin2Line, RiCloseLine } from "@remixicon/react";
import { AppShell } from "@/components/loop/AppShell";
import { useLoop } from "@/lib/loop-store";
import { SEED_PROJECTS, bomProgress, type MakerProject } from "@/lib/loop-projects";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/proyectos")({
  head: () => ({
    meta: [
      { title: "Proyectos y BOM Matcher · LOOP" },
      {
        name: "description",
        content:
          "Creá proyectos maker, listá su BOM y seguí el progreso de recolección de componentes en la red.",
      },
      { property: "og:title", content: "Proyectos y BOM Matcher · LOOP" },
      { property: "og:description", content: "Encontrá las piezas faltantes de tu próximo proyecto." },
    ],
  }),
  component: ProyectosPage,
});

function ProyectosPage() {
  const { listings } = useLoop();
  const { t } = useI18n();
  const [projects, setProjects] = useState<MakerProject[]>(SEED_PROJECTS);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [parts, setParts] = useState("");

  const create = () => {
    if (!name.trim() || !parts.trim()) return;
    const bom = parts
      .split(/[\n,]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => ({ name: p, qty: 1, keywords: p.toLowerCase().split(/\s+/).slice(0, 3) }));
    setProjects((prev) => [
      { id: `up${Date.now()}`, name: name.trim(), summary: "Proyecto propio", author: "Vos", bom },
      ...prev,
    ]);
    setName("");
    setParts("");
    setCreating(false);
  };

  return (
    <AppShell>
      <div className="space-y-5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
            <p className="text-sm text-muted-foreground">
              BOM Matcher: cruzá tu lista de materiales con el stock de la comunidad.
            </p>
          </div>
          <button
            onClick={() => setCreating((c) => !c)}
            aria-label={creating ? "Cancelar" : "Nuevo proyecto"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            {creating ? <RiCloseLine className="h-5 w-5" /> : <RiAddLine className="h-5 w-5" />}
          </button>
        </div>

        {creating ? (
          <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del proyecto"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <textarea
              value={parts}
              onChange={(e) => setParts(e.target.value)}
              rows={3}
              placeholder="Componentes separados por coma (ej: ESP32, sensor DHT22, fuente 12V)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={create}
              className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Crear proyecto
            </button>
          </div>
        ) : null}

        {projects.map((p) => {
          const { found, missing, total, done } = bomProgress(p, listings);
          return (
            <article key={p.id} className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.summary} · {p.author}
                </p>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  {done} de {total} piezas conseguidas en LOOP
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.round((done / total) * 100)}%` }}
                  />
                </div>
              </div>

              <ul className="space-y-1.5 text-sm">
                {p.bom.map((item) => {
                  const ok = found.includes(item);
                  return (
                    <li key={item.name} className="flex items-center gap-2">
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                          ok ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {ok ? <RiCheckLine className="h-3 w-3" /> : <RiCloseLine className="h-3 w-3" />}
                      </span>
                      <span className={ok ? "" : "text-muted-foreground"}>
                        {item.name} · x{item.qty}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Link
                to="/"
                search={{ bom: p.id }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium"
              >
                <RiMapPin2Line className="h-3.5 w-3.5" />
                {missing.length ? "Buscar faltantes en el mapa" : "Ver piezas en el mapa"}
              </Link>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
