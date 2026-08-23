import type { Listing } from "./loop-data";

/** Peso estimado (kg) y valor de reposición (ARS) por unidad, según categoría. */
type Factor = { kg: number; ars: number };

const FACTORS: Array<[RegExp, Factor]> = [
  [/(micro|placa|arduino|esp32|controlador)/, { kg: 0.02, ars: 9000 }],
  [/(sensor|módulo|modulo|rel[eé]|automatiz)/, { kg: 0.012, ars: 4500 }],
  [/(motor|driver|servo|stepper|nema)/, { kg: 0.32, ars: 14000 }],
  [/(fuente|aliment|energ|bater|lipo|power)/, { kg: 0.85, ars: 22000 }],
  [/(display|pantalla|oled|lcd)/, { kg: 0.03, ars: 7000 }],
  [/(sbc|raspberry|computad)/, { kg: 0.06, ars: 65000 }],
  [/(chatarra|e-waste|desarme)/, { kg: 0.075, ars: 900 }],
  [/(pasivo|resistenc|capacitor|protoboard|dupont|prototip)/, { kg: 0.002, ars: 350 }],
];

const DEFAULT: Factor = { kg: 0.05, ars: 3000 };

function factorFor(listing: Listing): Factor {
  const t = `${listing.category} ${listing.title}`.toLowerCase();
  for (const [re, f] of FACTORS) if (re.test(t)) return f;
  return DEFAULT;
}

export interface ImpactMetrics {
  /** kg de residuo electrónico evitado */
  ewasteKg: number;
  /** kg de CO2 equivalente compensado */
  co2Kg: number;
  /** ahorro comunitario estimado en ARS */
  savingsArs: number;
  /** cantidad total de piezas reinsertadas */
  pieces: number;
}

/** Factor de huella de carbono evitada por kg de hardware reusado. */
const CO2_PER_KG = 4.4;

export function impactOf(listings: Listing[]): ImpactMetrics {
  let ewasteKg = 0;
  let savingsArs = 0;
  let pieces = 0;

  for (const l of listings) {
    if (l.intent !== "ofrezco") continue;
    const f = factorFor(l);
    const q = Math.max(1, l.quantity || 1);
    ewasteKg += f.kg * q;
    savingsArs += f.ars * q;
    pieces += q;
  }

  return {
    ewasteKg: Math.round(ewasteKg * 10) / 10,
    co2Kg: Math.round(ewasteKg * CO2_PER_KG * 10) / 10,
    savingsArs: Math.round(savingsArs),
    pieces,
  };
}

export function formatArs(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}
