/** Puntos de retiro LOOP (demo). Ubicaciones ficticias de la red LOOP. */
export interface LoopNode {
  id: string;
  name: string;
  detail: string;
  zone: string;
  lat: number;
  lng: number;
  hours: string;
}

export const LOOP_NODES: LoopNode[] = [
  {
    id: "nodo-norte",
    name: "Nodo Tecnológico Norte",
    detail: "Punto de retiro LOOP demo",
    zone: "Zona Norte",
    lat: -24.7402,
    lng: -65.4258,
    hours: "Lun a Vie · 8 a 18 h",
  },
  {
    id: "hub-central",
    name: "Hub de Innovación Central",
    detail: "Punto de retiro LOOP demo",
    zone: "Zona Centro",
    lat: -24.7891,
    lng: -65.4118,
    hours: "Lun a Sáb · 10 a 20 h",
  },
  {
    id: "campus-maker",
    name: "Campus Maker Comunitario",
    detail: "Punto de retiro LOOP demo",
    zone: "Zona Oeste",
    lat: -24.8032,
    lng: -65.4402,
    hours: "Lun a Vie · 9 a 17 h",
  },
  {
    id: "centro-tec",
    name: "Centro de Tecnología Aplicada",
    detail: "Punto de retiro LOOP demo",
    zone: "Zona Sur",
    lat: -24.8155,
    lng: -65.4172,
    hours: "Lun a Vie · 8 a 21 h",
  },
];


/** ID de transacción determinístico y legible para el pase de retiro. */
export function pickupCode(listingId: string, nodeId: string): string {
  const raw = `${listingId}-${nodeId}`;
  let h = 2166136261;
  for (const ch of raw) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const part = h.toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
  return `LOOP-${nodeId.slice(0, 3).toUpperCase()}-${part}`;
}

/** Matriz pseudo-aleatoria determinística que simula un código QR. */
export function qrMatrix(seed: string, size = 21): boolean[][] {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const next = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967296;
  };
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => next() > 0.5),
  );
  const finder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[r0 + r]![c0 + c] = edge || core;
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  return grid;
}
