# LOOP · Hardware circular para makers

**Build. Learn. Reuse. Repeat. — Keep technology in motion.**

LOOP es una aplicación *mobile-first* que funciona como **mercado circular de hardware y red comunitaria para makers**. Permite identificar componentes con IA, ofrecerlos o solicitarlos, organizar retiros en **Nodos seguros** con verificación QR y medir el impacto ambiental de la reutilización — todo desde una pantalla pensada para celular.

> Una infraestructura física donde el hardware local circula entre makers, estudiantes y hubs. Toma una foto, matcheala, retirala en tu ciudad.

**Pitch deck** · [PDF en Google Drive](https://drive.google.com/file/d/1xe5w5yhfGZjatRnOtHoL_OUIs5cucGCm/view) · **Video pitch** · [YouTube](https://www.youtube.com/watch?v=Pk_kuXanXTg)

---

## El problema que resuelve

La basura electrónica crece más rápido que cualquier otro flujo de residuos. Al mismo tiempo, miles de makers, clubes de robótica, escuelas técnicas y talleres comunitarios necesitan piezas (ESP32, drivers A4988, servos, fuentes ATX, sensores) que terminan tiradas en cajones o en contenedores.

LOOP cierra ese ciclo atacando cuatro fricciones concretas:

| Fricción | Cómo se manifiesta |
|---|---|
| **Demoras de importación** | Un componente chico puede tardar semanas y costar mucho en flete. |
| **Hardware ocioso** | Placas y sensores quedan en cajones mientras la ciudad importa lo mismo. |
| **E-waste** | Equipamiento útil se descarta en vez de volver al circuito. |
| **Barreras de prototipado** | Makers y estudiantes se frenan por una pieza que podrían encontrar en su ciudad. |

### Propuesta de valor

Un **mercado circular local con operación global**: infraestructura física (Nodos) + matching con IA + cero fricción técnica (sacás una foto y matchea) + confianza (Maker Score) + impacto ambiental trazable.

| | LOOP |
|---|---|
| **Foco** | Reutilización real de hardware, no compra |
| **Unidad** | El Nodo físico de retiro (escuela/taller/maker space) |
| **Confianza** | Maker Score + publicaciones verificadas en Nodo + QR |
| **Datos** | Métricas de impacto ambiental cuantificables y trazables |
| **Acceso** | 100 % mobile-first, cámara + voz + IA generativa |

---

## Features principales

Las features están **implementadas en el código** de este repositorio (`src/routes`, `src/components/loop`, `src/lib`) y se mapean a los cinco pilares del pitch deck.

### 1. Identify — Identificación de hardware con IA (Tab *Agregar* · Ofrezco)
- Subida multi-foto + captura con cámara (`capture="environment"`) (`src/routes/agregar.tsx`).
- **Gemini Vision** (vía Lovable AI Gateway) lee la foto y autocompleta nombre, categoría, estado y tags técnicos (`src/lib/vision.functions.ts`, `src/lib/autotags.ts`).
- Extracción de términos técnicos (ESP32, Arduino, A4988…) con filtrado de stopwords en español.

### 2. Discovery — Mapa, voz y BOM matcher (Tab *Mapa* + *Proyectos*)
- Mapa real con `react-leaflet` + tiles CartoDB Voyager (`src/components/loop/MapView.tsx`).
- **Pins azules (#009DFF)** para *Ofrezco* y **pins naranjas (#FF8C00)** para *Necesito*.
- **Voz & lenguaje natural** (Web Speech API): *"necesito un motor paso a paso y un driver para un brazo pequeño"*.
- **BOM matcher**: proyectos maker con lista de materiales matcheada contra el inventario local de una vez (`src/lib/loop-projects.ts`, `src/routes/proyectos.tsx`).
- Filtros colapsables por categoría, **radio de cercanía (Haversine)** y switch *"solo verificados en Nodo"*; tags dinámicos en scroll horizontal extraídos del stock real.
- Bottom sheet con mini-preview y detalle completo + lightbox con zoom (`ListingDetail.tsx`, `Lightbox.tsx`).

### 3. Logistics — Nodos seguros y verificación QR
- Red de **Nodos demo** (Nodo Tecnológico Norte, Hub de Innovación Central, Campus Maker Comunitario, Centro de Tecnología Aplicada) como puntos de intercambio locales y seguros (`src/lib/loop-nodes.ts`).
- Botón *Retirar en Nodo Seguro* que genera un **Pase de Retiro con QR** que confirma identidad, origen y estado al retirar (`src/components/loop/PickupPass.tsx`).

### 4. Trust — Reputación y Maker Score (Tab *Perfil*)
- **Maker Score** estilo Uber/Airbnb construido sobre intercambios reales completados (`src/lib/loop-reputation.ts`, `src/routes/perfil.tsx`).
- Validación comunitaria, historial de intercambios trazable, identidad verificada y badges (Reciclador, Fundador).

### 5. Impact — Economía circular medible
- **Métricas de impacto ambiental**: kg de e-waste evitado, CO₂ compensado, ahorro comunitario en ARS y piezas reinsertadas (`src/lib/loop-impact.ts`).
- Reporte de sostenibilidad por Nodo y por proyecto; cada reuso es trazable.

### Feed & Actividad (Tab *Actividad*)
- Timeline de novedades agrupado en *Hoy*, *Esta semana*, *El mes pasado* con acción *Ver en el mapa* que centra y abre el detalle (`src/routes/actividad.tsx`).

### Ajustes & Cuenta (Tab *Ajustes*)
- Información de cuenta, **toggle dark/light**, preferencias y notificaciones.
- **Switcher de idioma Español / English** con estado global persistente que re-renderiza toda la app al instante (`src/lib/i18n.tsx`).
- Acceso rápido *Modo Demo (Jurado / Invitado)* en la pantalla de login (`src/components/loop/GoogleGate.tsx`).

### Sistema de diseño
- Tipografía **Instrument Sans** (Google Fonts).
- Paleta: fondo claro `#F8F9FA`, Azul Eléctrico `#009DFF` (Ofrezco), Naranja Vibrante `#FF8C00` (Necesito).
- Iconografía con **Remix Icon** (`@remixicon/react`) y mapeo categoría → icono + color (`src/lib/category-icons.tsx`).
- Header sticky con botón de cierre siempre visible en el detalle.

---

## Modelo de negocio y roadmap

### Modelo de negocio (sostenibilidad)
- **B2B / B2G**: trabajo con hubs e instituciones para abastecer Nodos locales.
- **Fee logístico**: una pequeña tarifa sobre la logística del Nodo fondea la red y mantiene el circuito activo.
- **Sponsoreo de componentes**: empresas devuelven hardware excedente a la comunidad.

### Roadmap
1. **Sandbox local** — primeros Nodos comunitarios y base piloto de makers.
2. **Expansión regional / país** — hubs técnicos en la región y el país.
3. **Escrow programable** — contratos y escrow para intercambio seguro.

> Los valores de impacto del demo son ilustrativos. El modelo está diseñado para medir el e-waste real evitado una vez que la red esté operativa.

---

## Arquitectura y Tech Stack

LOOP está construido sobre **TanStack Start v1** con SSR/SSG y Vite 8, desplegable como función Edge (Cloudflare Workers). El estado de la app vive en un `Context` de React con persistencia en `localStorage`.

```
┌─────────────────────────────────────────────┐
│  src/routes/__root.tsx                       │  Shell + providers
│   ├─ QueryClientProvider (TanStack Query)    │
│   ├─ I18nProvider (ES/EN)                    │
│   └─ LoopProvider (estado + persistencia)    │
├─────────────────────────────────────────────┤
│  Routes (file-based, TanStack Router)        │
│   index · actividad · agregar · perfil ·     │
│   ajustes · proyectos                        │
├─────────────────────────────────────────────┤
│  Components/loop                             │
│   AppShell · GoogleGate · MapView            │
│   ListingDetail · Lightbox · PickupPass      │
├─────────────────────────────────────────────┤
│  Lib                                         │
│   loop-data · loop-store · loop-impact       │
│   loop-nodes · loop-projects · loop-reputation│
│   autotags · category-icons · i18n           │
│   vision.functions (Gemini Vision gateway)   │
└─────────────────────────────────────────────┘
```

### Dependencias reales (de `package.json`)

| Categoría | Paquetes |
|---|---|
| **Framework** | `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-query` |
| **Build** | `vite` 8, `nitro`, `@lovable.dev/vite-tanstack-config`, `@vitejs/plugin-react` |
| **UI / Estilos** | `tailwindcss` v4, `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge`, `vaul` (bottom sheets) |
| **Primitivos UI** | `@radix-ui/*` (dialog, tabs, switch, slider, popover, etc.), `cmdk`, `sonner` (toasts) |
| **Iconografía** | `@remixicon/react` (Remix Icon), `lucide-react` |
| **Mapa** | `leaflet`, `react-leaflet`, `@types/leaflet` |
| **Formularios / Validación** | `react-hook-form`, `@hookform/resolvers`, `zod` |
| **Datos / Fechas / Gráficos** | `date-fns`, `recharts` |
| **Media** | `embla-carousel-react`, `react-day-picker`, `input-otp`, `react-resizable-panels` |
| **Core** | `react` 19, `react-dom` 19, `typescript` 5.8 |

> Lenguaje: **TypeScript** estricto. Linting: **ESLint** + **Prettier**.

### Server functions & boundaries
- `createServerFn` (de `@tanstack/react-start`) para lógica de servidor.
- El análisis de imágenes con **Gemini Vision** se invoca desde `src/lib/vision.functions.ts` a través de Lovable AI Gateway.
- El runtime Edge (`nodejs_compat`) soporta `crypto`, `fetch`, `stream`, etc. No se usan dependencias nativas Node-only.

---

## Guía rápida para correr el proyecto en local

### Requisitos
- **Node.js** 20+ (recomendado vía [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm**

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd loop

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo (Vite)
npm run dev
```

La app queda disponible en `http://localhost:8080` (o el puerto que informe Vite).

### Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción (`vite build`) |
| `npm run build:dev` | Build en modo development |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run format` | Formatea el código con Prettier |

### Primer arranque

La app viene **seedeada con 14 publicaciones realistas** (`src/lib/loop-data.ts`) que incluyen ESP32, drivers A4988, fuentes ATX, servos MG996R, Arduino Uno, sensores DHT22, NEMA 17, Raspberry Pi y más. En el primer load verás el mapa poblado, el feed de actividad y el perfil con métricas.

Para probar el flujo completo sin Google Sign-in, usá el botón **"Ingresar en Modo Demo (Jurado / Invitado)"** en la pantalla de login.

---

## Estructura del proyecto

```
src/
├── routes/                 # Rutas file-based (TanStack Router)
│   ├── __root.tsx          # Shell + providers + <head> global
│   ├── index.tsx           # Tab Mapa
│   ├── actividad.tsx       # Tab Actividad (feed)
│   ├── agregar.tsx         # Tab Agregar (Ofrezco/Necesito + IA)
│   ├── perfil.tsx          # Tab Perfil (reputación + impacto)
│   ├── ajustes.tsx         # Tab Ajustes (cuenta, tema, idioma)
│   └── proyectos.tsx      # Proyectos maker / BOM
├── components/loop/        # Componentes de dominio LOOP
│   ├── AppShell.tsx        # Navegación inferior de 5 tabs
│   ├── GoogleGate.tsx      # Login / bienvenida + Modo Demo
│   ├── MapView.tsx         # Mapa Leaflet interactivo
│   ├── ListingDetail.tsx  # Bottom sheet de detalle
│   ├── Lightbox.tsx        # Zoom de imagen
│   └── PickupPass.tsx      # Pase de retiro con QR
├── lib/                    # Lógica de dominio
│   ├── loop-data.ts        # Tipos, seed data, helpers (Haversine, buckets)
│   ├── loop-store.tsx      # Context de estado + persistencia localStorage
│   ├── loop-impact.ts      # Métricas ambientales (e-waste, CO₂, ARS)
│   ├── loop-nodes.ts       # Nodos físicos demo de retiro
│   ├── loop-projects.ts    # Proyectos maker + BOM matcher
│   ├── loop-reputation.ts  # Maker Score, badges y reseñas
│   ├── autotags.ts         # Extracción de tags técnicos + stopwords ES
│   ├── category-icons.tsx # Mapeo categoría → icono/color
│   ├── i18n.tsx            # Provider + diccionario ES/EN
│   └── vision.functions.ts# Server fn Gemini Vision
├── components/ui/          # Primitivos shadcn/ui (new-york)
└── styles.css              # Design system (Tailwind v4 + oklch)
```

---

## Créditos

Desarrollado por los co-fundadores de LOOP para la hackathon:

- **Facundo Romero** — Lead AI Builder & Product Strategy
- **Maria Gisel Chavez** — Product, Outreach & Project Operations

> *Build. Learn. Reuse. Repeat. — Keep technology in motion.*

---

*Este proyecto fue construido con [Lovable](https://lovable.dev).*
