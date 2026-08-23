/** Nodos físicos verificados donde se certifica la entrega de hardware. */
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
    id: "eet3100",
    name: "Nodo EET 3100",
    detail: "Lab de Electrónica",
    zone: "Zona Sur",
    lat: -24.8155,
    lng: -65.4172,
    hours: "Lun a Vie · 8 a 18 h",
  },
  {
    id: "vapadu",
    name: "Nodo Vapadu",
    detail: "Centro / Makerspace",
    zone: "Microcentro",
    lat: -24.7891,
    lng: -65.4118,
    hours: "Lun a Sáb · 10 a 20 h",
  },
  {
    id: "punto-digital",
    name: "Nodo Punto Digital",
    detail: "Sala comunitaria de tecnología",
    zone: "Ciudad del Milagro",
    lat: -24.8032,
    lng: -65.4402,
    hours: "Lun a Vie · 9 a 17 h",
  },
  {
    id: "ucasal",
    name: "Nodo UCASAL",
    detail: "Facultad de Ingeniería",
    zone: "Castañares",
    lat: -24.7402,
    lng: -65.4258,
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
