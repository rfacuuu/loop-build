import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/loop/AppShell";
import { useLoop } from "@/lib/loop-store";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, FileText, Moon, Shield, UserCog } from "lucide-react";

export const Route = createFileRoute("/ajustes")({
  head: () => ({
    meta: [
      { title: "Ajustes · LOOP Salta" },
      { name: "description", content: "Cuenta de Google, tema, notificaciones y privacidad en LOOP." },
      { property: "og:title", content: "Ajustes · LOOP Salta" },
      { property: "og:description", content: "Configurá tu cuenta y preferencias de LOOP." },
    ],
  }),
  component: AjustesPage,
});

function AjustesPage() {
  const { user, dark, toggleDark, signOut } = useLoop();

  return (
    <AppShell>
      <div className="space-y-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight">Ajustes</h1>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary">
            {user?.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">Cuenta de Google · {user?.email}</p>
          </div>
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 p-4">
            <Moon className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">Modo oscuro</span>
            <Switch checked={dark} onCheckedChange={toggleDark} />
          </div>
          <div className="flex items-center gap-3 p-4">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">Notificaciones de nuevas piezas</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center gap-3 p-4">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">Ocultar mi ubicación exacta</span>
            <Switch defaultChecked />
          </div>
          <button className="flex w-full items-center gap-3 p-4 text-left">
            <UserCog className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">Preferencias de contacto</span>
          </button>
          <button className="flex w-full items-center gap-3 p-4 text-left">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">Términos y privacidad</span>
          </button>
        </div>

        <Button variant="outline" className="w-full rounded-full" onClick={signOut}>
          Cerrar sesión
        </Button>
        <p className="pb-4 text-center text-xs text-muted-foreground">
          LOOP Salta · Build. Learn. Reuse. Repeat.
        </p>
      </div>
    </AppShell>
  );
}
