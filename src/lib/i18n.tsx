import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

const KEY = "loop.lang.v1";

const es = {
  "nav.map": "Mapa",
  "nav.activity": "Actividad",
  "nav.add": "Agregar",
  "nav.profile": "Perfil",
  "nav.settings": "Ajustes",
  "nav.projects": "Proyectos",

  "intent.ofrezco": "Ofrezco",
  "intent.necesito": "Necesito",
  "intent.todos": "Todos",

  "gate.slogan":
    "Build. Learn. Reuse. Repeat. La red circular de hardware para makers. Mantené la tecnología en movimiento.",
  "gate.google": "Continuar con Google",
  "gate.demo": "Ingresar en Modo Demo (Jurado / Invitado)",
  "gate.legal": "Verificamos identidades únicas para que los intercambios sean seguros.",

  "map.title": "Mapa",
  "map.subtitle": "Ubicaciones aproximadas por privacidad · {n} publicaciones activas",
  "map.search": "Buscar componentes…",
  "map.searchAria": "Buscar publicaciones",
  "map.clearSearch": "Limpiar búsqueda",
  "map.filters": "Filtros",
  "map.intention": "Intención",
  "map.distance": "Distancia",
  "map.all": "Todos",
  "map.onlyVerified": "Solo verificados en Punto LOOP",
  "map.clear": "Limpiar",
  "map.seeResults": "Ver {n} resultados",
  "map.expand": "Ampliar mapa",
  "map.collapse": "Reducir mapa",
  "map.missingOf": "Faltantes de {name}",
  "map.allPartsFound": "¡Ya conseguiste todas las piezas!",

  "activity.title": "Actividad",
  "activity.subtitle": "{n} componentes rescatados de la basura electrónica.",
  "activity.bomCard": "Proyectos · BOM Matcher",
  "activity.bomCardHint": "Cruzá tu lista de materiales con el stock de la comunidad",
  "activity.today": "Hoy",
  "activity.week": "Esta semana",
  "activity.month": "El mes pasado",
  "activity.saved": "{n} componente(s) salvados del e-waste",
  "activity.looking": "Busca {n} unidad(es)",
  "activity.viewOnMap": "Ver en el mapa",

  "projects.title": "Proyectos",
  "projects.subtitle": "BOM Matcher: cruzá tu lista de materiales con el stock de la comunidad.",
  "projects.new": "Nuevo proyecto",
  "projects.cancel": "Cancelar",
  "projects.namePlaceholder": "Nombre del proyecto",
  "projects.partsPlaceholder": "Componentes separados por coma (ej: ESP32, sensor DHT22, fuente 12V)",
  "projects.create": "Crear proyecto",
  "projects.progress": "{done} de {total} piezas conseguidas en LOOP",
  "projects.searchMissing": "Buscar piezas faltantes en el mapa",
  "projects.viewParts": "Ver piezas en el mapa",
  "projects.own": "Proyecto propio",
  "projects.you": "Vos",

  "add.back": "Volver",
  "add.question": "¿Qué querés publicar?",
  "add.offerTitle": "Ofrezco…",
  "add.offerDesc": "Tengo componentes, placas o chatarra electrónica para donar o intercambiar.",
  "add.offerCta": "Ofrecer",
  "add.needTitle": "Necesito…",
  "add.needDesc": "Busco piezas para armar un proyecto maker o de robótica.",
  "add.needCta": "Necesito",
  "add.takePhoto": "Tomar fotografía",
  "add.uploadPhoto": "Subir foto",
  "add.photoTitle": "Sacá una foto",
  "add.photoHint":
    "Apuntá directamente a lo que estás ofreciendo; mientras más fotografías en diferentes ángulos, mejor.",
  "add.analyzing": "IA analizando…",
  "add.detected": "Especificaciones sugeridas",
  "add.refined": "Refinado por IA",
  "add.notes": "Notas adicionales (estado, accesorios, horarios de entrega)…",
  "add.zone": "Zona aproximada",
  "add.contact": "Email / Teléfono / WhatsApp",
  "add.publish": "Publicar",
  "add.continue": "Continuar",
  "add.needPlaceholder": "Necesito un…",
  "add.hold": "Mantené para hablar",
  "add.attachPhoto": "Adjuntar foto / referencia",
  "add.describeTitle": "Describí lo que necesitás",
  "add.describeHint": "Mientras más detalles agregues, mejores resultados de búsqueda obtendrás.",
  "add.category": "Categoría",
  "add.publishedBlue": "Publicado en el mapa con pin azul",
  "add.publishedOrange": "Publicado en el mapa con pin naranja",
  "add.noSpeech": "Tu navegador no soporta dictado por voz. Escribí el pedido a mano.",
  "add.noMic": "No se pudo acceder al micrófono.",
  "add.imageError": "No se pudo leer la imagen.",
  "add.analyzeError": "No se pudo analizar la imagen.",

  "detail.close": "Cerrar detalle",
  "detail.fullDetail": "Ver detalle completo",
  "detail.publishedBy": "Publicado por",
  "detail.quantity": "Cantidad",
  "detail.published": "Publicado",
  "detail.assignedNode": "Nodo asignado",
  "detail.approxZone": "Zona aproximada",
  "detail.units": "{n} unidad(es)",
  "detail.radius": "{zone} (radio ~500 m)",
  "detail.makerScore": "Puntaje Maker · {n} intercambios completados",
  "detail.pickup": "Punto de retiro seguro",

  "pickup.title": "Pase de Retiro LOOP",
  "pickup.pick": "Elegí el Punto de retiro LOOP más cercano",
  "pickup.demo": "Ubicaciones demo de la red LOOP, no son sedes reales.",
  "pickup.legend":
    "Mostrá este QR en el Nodo para certificar la entrega física y activar la garantía de 48 hs.",
  "pickup.units": "{n} unidad(es)",

  "profile.impactTitle": "Impacto Circular",
  "profile.impactHint": "Calculado sobre tus publicaciones e intercambios completados.",
  "profile.ewaste": "Residuos electrónicos evitados",
  "profile.co2": "CO₂ compensado",
  "profile.savings": "Ahorro comunitario",
  "profile.badges": "Puntaje Maker · Badges de confianza",
  "profile.exchanges": "intercambios",
  "profile.handoffs": "Entregas",
  "profile.rating": "Rating",
  "profile.pieces": "Piezas reusadas",
  "profile.reviews": "Reviews",
  "profile.delete": "Eliminar",

  "settings.title": "Ajustes",
  "settings.googleAccount": "Cuenta de Google",
  "settings.language": "Idioma / Language",
  "settings.dark": "Modo oscuro",
  "settings.notifications": "Notificaciones de nuevas piezas",
  "settings.hideLocation": "Ocultar mi ubicación exacta",
  "settings.contactPrefs": "Preferencias de contacto",
  "settings.terms": "Términos y privacidad",
  "settings.signOut": "Cerrar sesión",
} as const;

export type TKey = keyof typeof es;

const en: Record<TKey, string> = {
  "nav.map": "Map",
  "nav.activity": "Explore",
  "nav.add": "Publish",
  "nav.profile": "Profile",
  "nav.settings": "Settings",
  "nav.projects": "Projects",

  "intent.ofrezco": "Offering",
  "intent.necesito": "Wanted",
  "intent.todos": "All",

  "gate.slogan":
    "Build. Learn. Reuse. Repeat. The circular hardware network for makers. Keep technology moving.",
  "gate.google": "Continue with Google",
  "gate.demo": "Enter Demo Mode (Judge / Guest)",
  "gate.legal": "We verify unique identities so every exchange stays safe.",

  "map.title": "Map",
  "map.subtitle": "Approximate locations for privacy · {n} active listings",
  "map.search": "Search components...",
  "map.searchAria": "Search listings",
  "map.clearSearch": "Clear search",
  "map.filters": "Filters",
  "map.intention": "Intent",
  "map.distance": "Distance",
  "map.all": "All",
  "map.onlyVerified": "Verified at LOOP Point only",
  "map.clear": "Clear",
  "map.seeResults": "See {n} results",
  "map.expand": "Expand map",
  "map.collapse": "Shrink map",
  "map.missingOf": "Missing parts for {name}",
  "map.allPartsFound": "You already got every part!",

  "activity.title": "Explore",
  "activity.subtitle": "{n} components rescued from e-waste.",
  "activity.bomCard": "Project BOM Matcher",
  "activity.bomCardHint": "Match your bill of materials with community stock",
  "activity.today": "Today",
  "activity.week": "This week",
  "activity.month": "Last month",
  "activity.saved": "{n} component(s) saved from e-waste",
  "activity.looking": "Looking for {n} unit(s)",
  "activity.viewOnMap": "View on map",

  "projects.title": "Projects",
  "projects.subtitle": "BOM Matcher: cross your bill of materials with community stock.",
  "projects.new": "New project",
  "projects.cancel": "Cancel",
  "projects.namePlaceholder": "Project name",
  "projects.partsPlaceholder": "Comma-separated parts (e.g. ESP32, DHT22 sensor, 12V supply)",
  "projects.create": "Create project",
  "projects.progress": "{done} of {total} parts sourced on LOOP",
  "projects.searchMissing": "Search missing parts",
  "projects.viewParts": "View parts on map",
  "projects.own": "Own project",
  "projects.you": "You",

  "add.back": "Back",
  "add.question": "What do you want to publish?",
  "add.offerTitle": "Offering…",
  "add.offerDesc": "I have components, boards or e-scrap to donate or trade.",
  "add.offerCta": "Offer",
  "add.needTitle": "Wanted…",
  "add.needDesc": "I'm looking for parts to build a maker or robotics project.",
  "add.needCta": "Request",
  "add.takePhoto": "Take photo",
  "add.uploadPhoto": "Upload photo",
  "add.photoTitle": "Take a photo",
  "add.photoHint": "Point straight at what you're offering; more angles means better results.",
  "add.analyzing": "AI analyzing...",
  "add.detected": "Suggested specs",
  "add.refined": "Refined by AI",
  "add.notes": "Extra notes (condition, accessories, handoff hours)…",
  "add.zone": "Approximate area",
  "add.contact": "Email / Phone / WhatsApp",
  "add.publish": "Publish",
  "add.continue": "Continue",
  "add.needPlaceholder": "I need a…",
  "add.hold": "Hold to speak",
  "add.attachPhoto": "Attach photo / reference",
  "add.describeTitle": "Describe what you need",
  "add.describeHint": "The more detail you add, the better the matches.",
  "add.category": "Category",
  "add.publishedBlue": "Published on the map with a blue pin",
  "add.publishedOrange": "Published on the map with an orange pin",
  "add.noSpeech": "Your browser doesn't support voice dictation. Type your request instead.",
  "add.noMic": "Microphone access failed.",
  "add.imageError": "The image could not be read.",
  "add.analyzeError": "The image could not be analyzed.",

  "detail.close": "Close detail",
  "detail.fullDetail": "View full detail",
  "detail.publishedBy": "Published by",
  "detail.quantity": "Quantity",
  "detail.published": "Published",
  "detail.assignedNode": "Assigned node",
  "detail.approxZone": "Approximate area",
  "detail.units": "{n} unit(s)",
  "detail.radius": "{zone} (~500 m radius)",
  "detail.makerScore": "Maker Score · {n} completed exchanges",
  "detail.pickup": "Safe Pickup Node",

  "pickup.title": "LOOP Pickup Pass",
  "pickup.pick": "Choose the closest LOOP pickup point",
  "pickup.demo": "Demo locations of the LOOP network, not real venues.",
  "pickup.legend":
    "Show this QR at the node to certify the physical handoff and activate the 48-hour warranty.",
  "pickup.units": "{n} unit(s)",

  "profile.impactTitle": "Circular Impact",
  "profile.impactHint": "Calculated from your listings and completed exchanges.",
  "profile.ewaste": "E-waste avoided",
  "profile.co2": "CO₂ offset",
  "profile.savings": "Community savings",
  "profile.badges": "Maker Score · Trust badges",
  "profile.exchanges": "exchanges",
  "profile.handoffs": "Handoffs",
  "profile.rating": "Rating",
  "profile.pieces": "Parts reused",
  "profile.reviews": "Reviews",
  "profile.delete": "Delete",

  "settings.title": "Settings",
  "settings.googleAccount": "Google account",
  "settings.language": "Language / Idioma",
  "settings.dark": "Dark mode",
  "settings.notifications": "New part notifications",
  "settings.hideLocation": "Hide my exact location",
  "settings.contactPrefs": "Contact preferences",
  "settings.terms": "Terms and privacy",
  "settings.signOut": "Sign out",
};

const DICTS: Record<Lang, Record<TKey, string>> = { es, en };

export type Translate = (key: TKey, vars?: Record<string, string | number>) => string;

interface I18nState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translate;
}

const Ctx = createContext<I18nState | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "en" || stored === "es") setLangState(stored);
  }, []);

  const value = useMemo<I18nState>(() => {
    const dict = DICTS[lang];
    return {
      lang,
      setLang: (l) => {
        setLangState(l);
        try {
          localStorage.setItem(KEY, l);
        } catch {
          /* ignore */
        }
      },
      t: (key, vars) => {
        let out = dict[key] ?? es[key] ?? String(key);
        if (vars) {
          for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
        }
        return out;
      },
    };
  }, [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
