import type { Listing } from "./loop-data";

export interface BomItem {
  /** nombre visible de la pieza */
  name: string;
  qty: number;
  /** palabras clave para matchear publicaciones disponibles */
  keywords: string[];
}

export interface MakerProject {
  id: string;
  name: string;
  summary: string;
  author: string;
  bom: BomItem[];
}

export const SEED_PROJECTS: MakerProject[] = [
  {
    id: "p1",
    name: "Brazo Robótico SCARA",
    summary: "Brazo de 4 GDL para clases de robótica y pick & place liviano.",
    author: "Club de Robótica",
    bom: [
      { name: "Servo de torque alto", qty: 4, keywords: ["servo", "mg996", "mg995"] },
      { name: "Driver paso a paso", qty: 2, keywords: ["a4988", "driver", "drv8825"] },
      { name: "Motor NEMA 17", qty: 2, keywords: ["nema", "paso a paso", "stepper"] },
      { name: "Placa controladora", qty: 1, keywords: ["arduino", "esp32", "microcontrolador"] },
      { name: "Fuente 12V", qty: 1, keywords: ["fuente", "atx", "12v", "aliment"] },
    ],
  },
  {
    id: "p2",
    name: "Estación Meteorológica IoT",
    summary: "Mide temperatura, humedad y presión y publica los datos por WiFi.",
    author: "Escuela Técnica",
    bom: [
      { name: "ESP32 con WiFi", qty: 1, keywords: ["esp32", "wifi"] },
      { name: "Sensor DHT22", qty: 1, keywords: ["dht", "temperatura", "humedad"] },
      { name: "Display OLED", qty: 1, keywords: ["oled", "display", "pantalla"] },
      { name: "Batería / panel", qty: 1, keywords: ["bater", "lipo", "panel"] },
      { name: "Protoboard y cables", qty: 1, keywords: ["protoboard", "dupont", "cable"] },
    ],
  },
  {
    id: "p3",
    name: "Riego Automático de Huerta",
    summary: "Controla bombas y electroválvulas según humedad de suelo.",
    author: "Huerta Comunitaria",
    bom: [
      { name: "Módulo relé 4 canales", qty: 1, keywords: ["rel", "automatiz"] },
      { name: "Sensor de humedad", qty: 2, keywords: ["humedad", "sensor", "dht"] },
      { name: "Arduino Uno", qty: 1, keywords: ["arduino", "uno"] },
      { name: "Fuente de banco", qty: 1, keywords: ["fuente", "atx", "aliment"] },
    ],
  },
];

export function matchesBom(listing: Listing, item: BomItem) {
  const hay = `${listing.title} ${listing.category} ${listing.tags.join(" ")}`.toLowerCase();
  return item.keywords.some((k) => hay.includes(k.toLowerCase()));
}

export function bomProgress(project: MakerProject, listings: Listing[]) {
  const offers = listings.filter((l) => l.intent === "ofrezco");
  const found = project.bom.filter((item) => offers.some((l) => matchesBom(l, item)));
  const missing = project.bom.filter((item) => !found.includes(item));
  return { found, missing, total: project.bom.length, done: found.length };
}
