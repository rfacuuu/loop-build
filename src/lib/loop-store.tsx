import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_LISTINGS, type Listing, type Intent } from "./loop-data";

export interface LoopUser {
  name: string;
  email: string;
  initials: string;
}

interface LoopState {
  hydrated: boolean;
  user: LoopUser | null;
  listings: Listing[];
  dark: boolean;
  signIn: () => void;
  signInDemo: () => void;
  signOut: () => void;
  toggleDark: () => void;
  addListing: (l: Omit<Listing, "id" | "createdAt" | "lat" | "lng">) => Listing;
  removeListing: (id: string) => void;
}

const Ctx = createContext<LoopState | null>(null);
const KEY = "loop.state.v1";

export function LoopProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<LoopUser | null>(null);
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.user) setUser(p.user);
        if (Array.isArray(p.listings) && p.listings.length) setListings(p.listings);
        if (typeof p.dark === "boolean") setDark(p.dark);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ user, listings, dark }));
  }, [hydrated, user, listings, dark]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", dark);
  }, [hydrated, dark]);

  const value = useMemo<LoopState>(
    () => ({
      hydrated,
      user,
      listings,
      dark,
      signIn: () =>
        setUser({ name: "Facundo Romero", email: "facundo.romero@gmail.com", initials: "FR" }),
      signInDemo: () => {
        setListings((prev) => (prev.length ? prev : SEED_LISTINGS));
        setUser({ name: "Jurado Invitado", email: "demo@loop.app", initials: "JI" });
      },
      signOut: () => setUser(null),
      toggleDark: () => setDark((d) => !d),
      addListing: (l) => {
        const item: Listing = {
          ...l,
          id: `u${Date.now()}`,
          createdAt: new Date().toISOString(),
          lat: -24.79 + (Math.random() - 0.5) * 0.08,
          lng: -65.41 + (Math.random() - 0.5) * 0.08,
        };
        setListings((prev) => [item, ...prev]);
        return item;
      },
      removeListing: (id) => setListings((prev) => prev.filter((l) => l.id !== id)),
    }),
    [hydrated, user, listings, dark],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLoop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLoop must be used inside LoopProvider");
  return ctx;
}

export type { Listing, Intent };
