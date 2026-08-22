import {
  RiCpuLine,
  RiRadarLine,
  RiSettings4Line,
  RiBattery2ChargeLine,
  RiToolsLine,
  RiTvLine,
  RiComputerLine,
  RiRecycleLine,
  type RemixiconComponentType,
} from "@remixicon/react";

export interface CategoryStyle {
  Icon: RemixiconComponentType;
  /** badge / chip classes */
  badge: string;
  /** icon tile classes */
  tile: string;
  label: string;
}

const MICRO: CategoryStyle = {
  Icon: RiCpuLine,
  badge: "bg-primary/10 text-primary",
  tile: "bg-primary/10 text-primary",
  label: "Microcontroladores / Placas",
};

const SENSORS: CategoryStyle = {
  Icon: RiRadarLine,
  badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  tile: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  label: "Sensores y módulos",
};

const MOTORS: CategoryStyle = {
  Icon: RiSettings4Line,
  badge: "bg-accent/15 text-accent",
  tile: "bg-accent/15 text-accent",
  label: "Motores y drivers",
};

const POWER: CategoryStyle = {
  Icon: RiBattery2ChargeLine,
  badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  tile: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  label: "Fuentes y energía",
};

const PASSIVE: CategoryStyle = {
  Icon: RiToolsLine,
  badge: "bg-muted text-muted-foreground",
  tile: "bg-muted text-muted-foreground",
  label: "Pasivos / otros",
};

const DISPLAY: CategoryStyle = { ...MICRO, Icon: RiTvLine, label: "Displays" };
const SBC: CategoryStyle = { ...MICRO, Icon: RiComputerLine, label: "Computadoras SBC" };
const SCRAP: CategoryStyle = { ...PASSIVE, Icon: RiRecycleLine, label: "Chatarra electrónica" };

export function categoryStyle(input: string): CategoryStyle {
  const t = (input ?? "").toLowerCase();
  if (/(micro|placa|arduino|esp32|controlador)/.test(t)) return MICRO;
  if (/(sensor|módulo|modulo|radar|automatiz|rel[eé])/.test(t)) return SENSORS;
  if (/(motor|driver|servo|stepper|nema)/.test(t)) return MOTORS;
  if (/(fuente|aliment|energ|bater|lipo|power)/.test(t)) return POWER;
  if (/(display|pantalla|oled|lcd)/.test(t)) return DISPLAY;
  if (/(sbc|raspberry|computad)/.test(t)) return SBC;
  if (/(chatarra|e-waste|desarme|reciclad)/.test(t)) return SCRAP;
  return PASSIVE;
}
