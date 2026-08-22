import { useLoop } from "@/lib/loop-store";
import { Button } from "@/components/ui/button";

export function GoogleGate() {
  const { signIn } = useLoop();
  return (
    <div className="flex min-h-[70vh] flex-col justify-center gap-8 px-6 text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Build. Learn. Reuse. Repeat.</h1>
        <p className="text-sm text-muted-foreground">
          La red circular de hardware para makers de Salta. Mantené la tecnología en movimiento.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        {["♻️ Reuso local", "📍 Mapa de Salta", "⭐ Reputación"].map((t) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-3">
            {t}
          </div>
        ))}
      </div>
      <Button size="lg" className="rounded-full" onClick={signIn}>
        <span className="mr-2 grid h-5 w-5 place-items-center rounded-full bg-background text-[11px] font-bold text-foreground">
          G
        </span>
        Continuar con Google
      </Button>
      <p className="text-xs text-muted-foreground">
        Verificamos identidades únicas para que los intercambios sean seguros.
      </p>
    </div>
  );
}
