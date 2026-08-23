import { RiGoogleFill, RiFlashlightLine } from "@remixicon/react";
import { useLoop } from "@/lib/loop-store";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import hero from "@/assets/loop-hero.jpg.asset.json";

export function GoogleGate() {
  const { signIn, signInDemo } = useLoop();
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative -mt-px">
        <img
          src={hero.url}
          alt="Logo LOOP iluminado rodeado de componentes electrónicos reutilizables"
          width={1024}
          height={1536}
          className="h-[58vh] w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="-mt-10 flex flex-1 flex-col justify-end gap-7 px-6 pb-10">
        <p className="text-center text-base text-muted-foreground">{t("gate.slogan")}</p>

        <div className="space-y-3">
          <Button size="lg" className="w-full rounded-full" onClick={signIn}>
            <RiGoogleFill className="mr-2 h-5 w-5" />
            {t("gate.google")}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full rounded-full"
            onClick={signInDemo}
          >
            <RiFlashlightLine className="mr-2 h-5 w-5" />
            {t("gate.demo")}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">{t("gate.legal")}</p>
      </div>
    </div>
  );
}
