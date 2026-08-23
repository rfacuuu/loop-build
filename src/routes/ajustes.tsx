import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/loop/AppShell";
import { useLoop } from "@/lib/loop-store";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RiNotification3Line as Bell, RiFileTextLine as FileText, RiMoonLine as Moon, RiShieldCheckLine as Shield, RiUserSettingsLine as UserCog, RiTranslate2 as Translate } from "@remixicon/react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/ajustes")({
  head: () => ({
    meta: [
      { title: "Ajustes · LOOP" },
      { name: "description", content: "Cuenta de Google, tema, notificaciones y privacidad en LOOP." },
      { property: "og:title", content: "Ajustes · LOOP" },
      { property: "og:description", content: "Configurá tu cuenta y preferencias de LOOP." },
    ],
  }),
  component: AjustesPage,
});

function AjustesPage() {
  const { user, dark, toggleDark, signOut } = useLoop();
  const { t, lang, setLang } = useI18n();

  return (
    <AppShell>
      <div className="space-y-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("settings.title")}</h1>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary">
            {user?.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {t("settings.googleAccount")} · {user?.email}
            </p>
          </div>
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 p-4">
            <Translate className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t("settings.language")}</span>
            <div
              role="group"
              aria-label={t("settings.language")}
              className="flex shrink-0 gap-1 rounded-full bg-muted p-1"
            >
              {([
                ["es", "Español"],
                ["en", "English"],
              ] as const).map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={lang === code}
                  onClick={() => setLang(code)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    lang === code
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Moon className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t("settings.dark")}</span>
            <Switch checked={dark} onCheckedChange={toggleDark} />
          </div>
          <div className="flex items-center gap-3 p-4">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t("settings.notifications")}</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center gap-3 p-4">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t("settings.hideLocation")}</span>
            <Switch defaultChecked />
          </div>
          <button className="flex w-full items-center gap-3 p-4 text-left">
            <UserCog className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t("settings.contactPrefs")}</span>
          </button>
          <button className="flex w-full items-center gap-3 p-4 text-left">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t("settings.terms")}</span>
          </button>
        </div>

        <Button variant="outline" className="w-full rounded-full" onClick={signOut}>
          {t("settings.signOut")}
        </Button>
        <p className="pb-4 text-center text-xs text-muted-foreground">
          LOOP · Build. Learn. Reuse. Repeat.
        </p>
      </div>
    </AppShell>
  );
}
