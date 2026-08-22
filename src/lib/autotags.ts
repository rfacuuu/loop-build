/** Extracción de tags técnicos a partir de texto libre en español. */

const STOPWORDS = new Set([
  "necesito","busco","quiero","tengo","hola","porfa","favor","gracias","urgente","alguien","alguno",
  "para","con","sin","por","desde","hasta","sobre","entre","como","muy","mas","más","menos",
  "el","la","los","las","un","una","unos","unas","del","al","lo","le","les","se","su","sus","mi","mis",
  "que","cual","cuales","este","esta","estos","estas","ese","esa","eso","aquel","alli","ahi","aca","acá",
  "de","en","y","o","u","a","es","son","ser","estar","hay","tener","poder","hacer","armar","proyecto",
  "uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","varios","varias","algunos",
  "cosa","cosas","tema","zona","barrio","precio","gratis","cambio","persona","gente","ayuda","hola,",
  "pero","tambien","también","ya","aun","aún","solo","sólo","bien","mal","poco","mucho","cualquier",
]);

/** Componentes / términos técnicos reconocidos → etiqueta canónica. */
const KNOWN: Array<[RegExp, string]> = [
  [/\besp\s?-?32\b/i, "ESP32"],
  [/\besp\s?-?8266\b/i, "ESP8266"],
  [/\barduino\s*(uno|nano|mega|leonardo)?\b/i, "Arduino"],
  [/\braspberry\s*(pi)?\b/i, "Raspberry Pi"],
  [/\bstm\s?-?32\b/i, "STM32"],
  [/\bpic\b/i, "PIC"],
  [/\bprotoboard|breadboard\b/i, "Protoboard"],
  [/\bnema\s?-?17\b/i, "NEMA 17"],
  [/\ba4988\b/i, "Driver A4988"],
  [/\bdrv\s?8825\b/i, "Driver DRV8825"],
  [/\bl298n?\b/i, "Driver L298N"],
  [/\bservo(motor)?s?\b/i, "Servomotor"],
  [/\bmotor(es)?\b/i, "Motores"],
  [/\bdriver(s)?\b/i, "Drivers"],
  [/\bfuente\s*atx\b/i, "Fuente ATX"],
  [/\bfuente(s)?\b/i, "Fuente"],
  [/\bbater[ií]a(s)?\b/i, "Baterías"],
  [/\b18650\b/i, "Celdas 18650"],
  [/\bresistencia(s)?\b/i, "Resistencias"],
  [/\bcapacitor(es)?|condensador(es)?\b/i, "Capacitores"],
  [/\bdiodo(s)?\b/i, "Diodos"],
  [/\btransistor(es)?\b/i, "Transistores"],
  [/\bpotenci[oó]metro(s)?\b/i, "Potenciómetros"],
  [/\brel[eé](s|vador)?\b/i, "Relés"],
  [/\bsensor(es)?\b/i, "Sensores"],
  [/\bdht\s?-?(11|22)\b/i, "Sensor DHT"],
  [/\bhc\s?-?sr\s?-?04\b/i, "Sensor HC-SR04"],
  [/\bmpu\s?-?6050\b/i, "MPU6050"],
  [/\bultrasonido|ultras[oó]nico\b/i, "Ultrasonido"],
  [/\bdisplay(s)?|pantalla(s)?\b/i, "Display"],
  [/\boled\b/i, "OLED"],
  [/\blcd\b/i, "LCD"],
  [/\bled(s)?\b/i, "LEDs"],
  [/\bcable(s)?|jumper(s)?\b/i, "Cables / jumpers"],
  [/\bsolda(dor|dura)|esta[ñn]o\b/i, "Soldadura"],
  [/\bimpresora\s*3d|3d\b/i, "Impresión 3D"],
  [/\bpcb(s)?\b/i, "PCB"],
  [/\bteclado|matricial\b/i, "Teclado"],
  [/\bc[aá]mara\b/i, "Cámara"],
  [/\bbluetooth|hc\s?-?05\b/i, "Bluetooth"],
  [/\bwifi|wi-fi\b/i, "WiFi"],
  [/\brob[oó]tica|robot\b/i, "Robótica"],
  [/\bdomotica|dom[oó]tica\b/i, "Domótica"],
];

export function extractTags(text: string, max = 5): string[] {
  const tags: string[] = [];
  for (const [re, label] of KNOWN) {
    if (re.test(text) && !tags.includes(label)) tags.push(label);
    if (tags.length >= max) return tags;
  }

  // Complemento: palabras técnicas plausibles (no stopwords, con dígitos o largas).
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  for (const w of words) {
    if (tags.length >= max) break;
    if (STOPWORDS.has(w) || w.length < 5) continue;
    const label = w.charAt(0).toUpperCase() + w.slice(1);
    if (!tags.some((t) => t.toLowerCase() === label.toLowerCase())) tags.push(label);
  }
  return tags;
}
