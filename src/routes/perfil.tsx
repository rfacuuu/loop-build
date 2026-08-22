import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Star, Trash2 } from "lucide-react";
import { AppShell } from "@/components/loop/AppShell";
import { useLoop } from "@/lib/loop-store";
import { timeAgo } from "@/lib/loop-data";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil y reputación · LOOP Salta" },
      {
        name: "description",
        content: "Tu reputación maker, entregas completadas y publicaciones activas en LOOP.",
      },
      { property: "og:title", content: "Perfil y reputación · LOOP Salta" },
      { property: "og:description", content: "Reputación verificada de la comunidad maker de Salta." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { user, listings, removeListing } = useLoop();
  const [tab, setTab] = useState<"necesito" | "ofrezco">("ofrezco");
  const mine = listings.filter((l) => l.intent === tab);

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
              <Star className="h-4 w-4 fill-accent text-accent" /> 4.9
              <span className="font-normal text-muted-foreground">· 27 intercambios</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["27", "Entregas"],
            ["4.9", "Rating"],
            ["94", "Piezas reusadas"],
          ].map(([v, k]) => (
            <div key={k} className="rounded-2xl border border-border bg-card p-3 shadow-sm">
              <p className="text-lg font-bold">{v}</p>
              <p className="text-[11px] text-muted-foreground">{k}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
          {(["necesito", "ofrezco"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full py-2 text-sm font-medium transition-colors ${
                tab === t ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t === "necesito" ? "Lo que necesito" : "Lo que ofrezco"}
            </button>
          ))}
        </div>

        <ul className="space-y-3">
          {mine.map((l) => (
            <li
              key={l.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-xl">
                {l.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{l.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {l.status} · {timeAgo(l.createdAt)}
                </span>
              </span>
              <button
                aria-label="Eliminar"
                onClick={() => removeListing(l.id)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
