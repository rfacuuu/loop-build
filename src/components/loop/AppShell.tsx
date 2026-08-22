import { Link, useRouterState } from "@tanstack/react-router";
import { RiMapPin2Line, RiNewspaperLine, RiAddLine, RiUser3Line, RiSettings3Line, type RemixiconComponentType } from "@remixicon/react";
import type { ReactNode } from "react";
import logo from "@/assets/loop_logo.svg.asset.json";
import { useLoop } from "@/lib/loop-store";
import { GoogleGate } from "./GoogleGate";

type Tab = { to: "/" | "/actividad" | "/agregar" | "/perfil" | "/ajustes"; icon: RemixiconComponentType; label: string; center?: boolean };

const tabs: Tab[] = [
  { to: "/", icon: RiMapPin2Line, label: "Mapa" },
  { to: "/actividad", icon: RiNewspaperLine, label: "Actividad" },
  { to: "/agregar", icon: RiAddLine, label: "Agregar", center: true },
  { to: "/perfil", icon: RiUser3Line, label: "Perfil" },
  { to: "/ajustes", icon: RiSettings3Line, label: "Ajustes" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, hydrated } = useLoop();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background shadow-xl">
        <header className="sticky top-0 z-20 flex items-center justify-center border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
          <img src={logo.url} alt="LOOP" className="h-7 w-auto" />
        </header>

        <main className="flex-1 pb-24">{!hydrated ? null : user ? children : <GoogleGate />}</main>

        {user ? (
          <nav className="fixed bottom-0 z-30 w-full max-w-md border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
            <ul className="grid grid-cols-5 items-center py-2">
              {tabs.map(({ to, icon: Icon, label, center }) => {
                const active = pathname === to;
                return (
                  <li key={to} className="flex justify-center">
                    <Link
                      to={to}
                      aria-label={label}
                      className={
                        center
                          ? "-mt-6 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : `grid h-11 w-11 place-items-center rounded-full transition-colors ${
                              active ? "bg-primary/10 text-primary" : "text-muted-foreground"
                            }`
                      }
                    >
                      <Icon className={center ? "h-7 w-7" : "h-5 w-5"} strokeWidth={2.2} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
