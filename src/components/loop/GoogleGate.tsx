import { RiGoogleFill, RiFlashlightLine } from "@remixicon/react";
import { useLoop } from "@/lib/loop-store";
import { Button } from "@/components/ui/button";
import banner from "@/assets/loop-banner.jpg";

export function GoogleGate() {
  const { signIn, signInDemo } = useLoop();
  return (
    <div className="flex min-h-[75vh] flex-col justify-center gap-7 px-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <img
          src={banner}
          alt="Componentes electrónicos reutilizados dispuestos en círculo"
          width={1024}
          height={768}
          className="h-52 w-full object-cover"
        />
      </div>

      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight">LOOP</h1>
        <p className="text-sm text-muted-foreground">
          Build. Learn. Reuse. Repeat. La red circular de hardware para makers. Mantené la
          tecnología en movimiento.
        </p>
      </div>

      <div className="space-y-3">
        <Button size="lg" className="w-full rounded-full" onClick={signIn}>
          <RiGoogleFill className="mr-2 h-5 w-5" />
          Continuar con Google
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="w-full rounded-full"
          onClick={signInDemo}
        >
          <RiFlashlightLine className="mr-2 h-5 w-5" />
          Ingresar en Modo Demo (Jurado / Invitado)
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Verificamos identidades únicas para que los intercambios sean seguros.
      </p>
    </div>
  );
}
