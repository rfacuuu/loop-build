export type Intent = "ofrezco" | "necesito";

export interface Listing {
  id: string;
  intent: Intent;
  title: string;
  category: string;
  status: string;
  description: string;
  tags: string[];
  zone: string;
  contact: { type: "whatsapp" | "email"; value: string };
  owner: string;
  quantity: number;
  createdAt: string; // ISO
  lat: number;
  lng: number;
  emoji?: string;
  photo?: string;
}

const daysAgo = (d: number, h = 3) =>
  new Date(Date.now() - d * 86400000 - h * 3600000).toISOString();

export const SEED_LISTINGS: Listing[] = [
  {
    id: "l1",
    intent: "ofrezco",
    title: "ESP32 DevKit V1",
    category: "Microcontroladores",
    status: "Operativo - Pines sanos",
    description:
      "Placa ESP32 con WiFi y Bluetooth, probada con Arduino IDE. Sobrante de un proyecto de domótica del taller.",
    tags: ["ESP32", "WiFi", "IoT", "3.3V"],
    zone: "Microcentro · Balcarce",
    contact: { type: "whatsapp", value: "+54 387 415 2210" },
    owner: "Martín Guaymás",
    quantity: 2,
    createdAt: daysAgo(0, 2),
    lat: -24.7883,
    lng: -65.4106,
    emoji: "🧠",
  },
  {
    id: "l2",
    intent: "ofrezco",
    title: "Drivers A4988 (x6)",
    category: "Drivers y motores",
    status: "Operativo - Con disipador",
    description:
      "Seis drivers A4988 recuperados de una impresora 3D dada de baja. Incluyen disipadores adhesivos.",
    tags: ["A4988", "CNC", "Stepper", "Reuso"],
    zone: "E.E.T. N°3100 · Zona Sur",
    contact: { type: "whatsapp", value: "+54 387 502 8891" },
    owner: "Taller E.E.T. 3100",
    quantity: 6,
    createdAt: daysAgo(0, 6),
    lat: -24.8155,
    lng: -65.4172,
    emoji: "⚙️",
  },
  {
    id: "l3",
    intent: "necesito",
    title: "Servos MG996R para brazo robótico",
    category: "Servomotores",
    status: "Buscando 4 unidades",
    description:
      "Estamos armando un brazo robótico de 4 GDL para la feria de ciencias. Necesitamos servos con torque alto.",
    tags: ["MG996R", "Robótica", "Feria de ciencias"],
    zone: "UNSa · Av. Bolivia",
    contact: { type: "email", value: "robotica.unsa@gmail.com" },
    owner: "Club de Robótica UNSa",
    quantity: 4,
    createdAt: daysAgo(1),
    lat: -24.7274,
    lng: -65.4102,
    emoji: "🦾",
  },
  {
    id: "l4",
    intent: "ofrezco",
    title: "Fuente ATX 500W",
    category: "Alimentación",
    status: "Operativo - Ventilador ruidoso",
    description:
      "Fuente ATX de PC de escritorio. Ideal para convertir en fuente de banco 12V/5V. Enciende puenteando PS_ON.",
    tags: ["ATX", "12V", "Fuente de banco"],
    zone: "Barrio Tres Cerritos",
    contact: { type: "whatsapp", value: "+54 387 611 0043" },
    owner: "Lucía Cardozo",
    quantity: 1,
    createdAt: daysAgo(2),
    lat: -24.7647,
    lng: -65.3908,
    emoji: "🔌",
  },
  {
    id: "l5",
    intent: "ofrezco",
    title: "Arduino Uno R3 (clon)",
    category: "Microcontroladores",
    status: "Operativo - USB reemplazado",
    description:
      "Clon de Arduino Uno con chip CH340. Se le cambió el conector USB, funciona perfecto para prototipos.",
    tags: ["Arduino", "CH340", "Prototipado"],
    zone: "Zona Oeste",
    contact: { type: "whatsapp", value: "+54 387 444 7712" },
    owner: "Campus Maker Comunitario",
    quantity: 3,
    createdAt: daysAgo(3),
    lat: -24.8032,
    lng: -65.4402,
    emoji: "🧩",
  },
  {
    id: "l6",
    intent: "necesito",
    title: "Sensores DHT22",
    category: "Sensores",
    status: "Buscando 2 unidades",
    description:
      "Para una estación meteorológica escolar. Servirían también DHT11 si están calibrados.",
    tags: ["DHT22", "Temperatura", "Humedad"],
    zone: "Cerrillos",
    contact: { type: "whatsapp", value: "+54 387 570 3388" },
    owner: "Escuela Técnica Cerrillos",
    quantity: 2,
    createdAt: daysAgo(4),
    lat: -24.8965,
    lng: -65.4842,
    emoji: "🌡️",
  },
  {
    id: "l7",
    intent: "ofrezco",
    title: "Lote de resistencias y capacitores",
    category: "Componentes pasivos",
    status: "Nuevo - Sin usar",
    description:
      "Aproximadamente 400 resistencias 1/4W surtidas y 80 capacitores electrolíticos. Vienen en caja organizadora.",
    tags: ["Pasivos", "Kit", "Soldadura"],
    zone: "Microcentro · Caseros",
    contact: { type: "email", value: "makers.colectivo@gmail.com" },
    owner: "Colectivo Makers",
    quantity: 480,
    createdAt: daysAgo(5),
    lat: -24.7906,
    lng: -65.4165,
    emoji: "🎛️",
  },
  {
    id: "l8",
    intent: "ofrezco",
    title: "Pantallas OLED 0.96\" I2C",
    category: "Displays",
    status: "Operativo - Testeadas",
    description: "Dos displays OLED monocromo 128x64 con bus I2C, probadas con librería SSD1306.",
    tags: ["OLED", "I2C", "SSD1306"],
    zone: "Barrio El Tribuno",
    contact: { type: "whatsapp", value: "+54 387 488 1120" },
    owner: "Nahuel Ríos",
    quantity: 2,
    createdAt: daysAgo(6),
    lat: -24.7742,
    lng: -65.3822,
    emoji: "🖥️",
  },
  {
    id: "l9",
    intent: "necesito",
    title: "Módulo relé de 4 canales",
    category: "Automatización",
    status: "Buscando 1 unidad",
    description:
      "Para automatizar el riego de la huerta comunitaria del barrio. Preferentemente optoacoplado.",
    tags: ["Relé", "Riego", "Huerta"],
    zone: "Villa San Luis",
    contact: { type: "whatsapp", value: "+54 387 533 9902" },
    owner: "Huerta Comunitaria San Luis",
    quantity: 1,
    createdAt: daysAgo(9),
    lat: -24.8221,
    lng: -65.4453,
    emoji: "🔁",
  },
  {
    id: "l10",
    intent: "ofrezco",
    title: "Motores paso a paso NEMA 17",
    category: "Drivers y motores",
    status: "Operativo - Ejes rectos",
    description:
      "Tres NEMA 17 sacados de impresoras 3D. Bobinados sanos, cables con conector JST incluido.",
    tags: ["NEMA17", "CNC", "Impresión 3D"],
    zone: "Zona Norte",
    contact: { type: "whatsapp", value: "+54 387 622 4417" },
    owner: "Nodo Tecnológico Norte",
    quantity: 3,
    createdAt: daysAgo(12),
    lat: -24.7402,
    lng: -65.4258,
    emoji: "🔩",
  },
  {
    id: "l11",
    intent: "ofrezco",
    title: "Raspberry Pi 3B + fuente",
    category: "Computadoras SBC",
    status: "Operativo - Sin microSD",
    description:
      "Raspberry Pi 3B funcionando, con fuente original 5V 2.5A. No incluye tarjeta microSD ni gabinete.",
    tags: ["Raspberry Pi", "Linux", "SBC"],
    zone: "Microcentro · España",
    contact: { type: "email", value: "red.reuso@gmail.com" },
    owner: "Red de Reuso",
    quantity: 1,
    createdAt: daysAgo(20),
    lat: -24.7838,
    lng: -65.4051,
    emoji: "🍓",
  },
  {
    id: "l12",
    intent: "necesito",
    title: "Batería LiPo 3S 2200mAh",
    category: "Alimentación",
    status: "Buscando 2 unidades",
    description:
      "Para un dron educativo del taller de electrónica. Aceptamos baterías usadas con celdas balanceadas.",
    tags: ["LiPo", "Dron", "3S"],
    zone: "Zona Sur · Solidaridad",
    contact: { type: "whatsapp", value: "+54 387 590 2255" },
    owner: "Taller de Drones",
    quantity: 2,
    createdAt: daysAgo(28),
    lat: -24.8288,
    lng: -65.4098,
    emoji: "🔋",
  },
  {
    id: "l13",
    intent: "ofrezco",
    title: "Chatarra de placas madre (3kg)",
    category: "Chatarra electrónica",
    status: "Para desarme y recuperación",
    description:
      "Placas madre y de video para recuperar componentes: MOSFETs, bobinas, capacitores sólidos y conectores.",
    tags: ["Chatarra", "Desarme", "E-waste"],
    zone: "Barrio Intersindical",
    contact: { type: "whatsapp", value: "+54 387 401 6690" },
    owner: "Julieta Vilte",
    quantity: 40,
    createdAt: daysAgo(31),
    lat: -24.7695,
    lng: -65.3712,
    emoji: "♻️",
  },
  {
    id: "l14",
    intent: "necesito",
    title: "Cable dupont y protoboard",
    category: "Prototipado",
    status: "Buscando 1 kit",
    description: "Para el club de programación del taller comunitario del barrio. Cualquier cantidad suma.",
    tags: ["Protoboard", "Dupont", "Club"],
    zone: "Zona Oeste",
    contact: { type: "email", value: "taller.comunitario@correo.com" },
    owner: "Taller Comunitario Oeste",
    quantity: 1,
    createdAt: daysAgo(33),
    lat: -24.8022,
    lng: -65.4531,
    emoji: "🧵",
  },
];

export const CATEGORIES = [
  "Microcontroladores",
  "Sensores",
  "Drivers y motores",
  "Alimentación",
  "Displays",
  "Componentes pasivos",
  "Chatarra electrónica",
  "Prototipado",
  "Automatización",
  "Computadoras SBC",
  "Servomotores",
];

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "hace minutos";
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} d`;
  if (d < 31) return `hace ${Math.floor(d / 7)} sem`;
  return `hace ${Math.floor(d / 30)} mes`;
}

export function bucketOf(iso: string): "Hoy" | "Esta semana" | "El mes pasado" {
  const d = (Date.now() - new Date(iso).getTime()) / 86400000;
  if (d < 1) return "Hoy";
  if (d < 7) return "Esta semana";
  return "El mes pasado";
}

/** Centro de referencia del mapa (vista regional por defecto). */
export const MAP_CENTER: [number, number] = [-24.79, -65.41];

/** Distancia aproximada en km entre dos coordenadas (haversine). */
export function distanceKm(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number],
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Publicaciones validadas en un Nodo físico (determinístico por id). */
export function isVerified(listing: Listing): boolean {
  let h = 0;
  for (const ch of listing.id) h = (h * 31 + ch.charCodeAt(0)) % 1000;
  return h % 3 !== 0;
}

/** Grupos de categoría usados en los filtros rápidos del mapa. */
export const CATEGORY_GROUPS = [
  { id: "micro", label: "Microcontroladores", re: /(micro|placa|arduino|esp32|sbc|raspberry)/i },
  { id: "sensores", label: "Sensores", re: /(sensor|m[oó]dulo|rel[eé]|automatiz|dht)/i },
  { id: "motores", label: "Motores", re: /(motor|driver|servo|stepper|nema)/i },
  { id: "fuentes", label: "Fuentes", re: /(fuente|aliment|energ|bater|lipo)/i },
] as const;

export function inCategoryGroup(listing: Listing, groupId: string): boolean {
  const group = CATEGORY_GROUPS.find((g) => g.id === groupId);
  if (!group) return true;
  return group.re.test(`${listing.category} ${listing.title} ${listing.tags.join(" ")}`);
}
