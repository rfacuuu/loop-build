# LOOP · Circular hardware for makers

**Build. Learn. Reuse. Repeat. — Keep technology in motion.**

**Pitch deck** · [PDF on Google Drive](https://drive.google.com/file/d/1xe5w5yhfGZjatRnOtHoL_OUIs5cucGCm/view) · **Pitch video** · [YouTube](https://www.youtube.com/watch?v=Pk_kuXanXTg)

LOOP is a *mobile-first* app that works as a **circular hardware marketplace and community network for makers**. It lets you identify components with AI, offer or request them, organize pickups at secure **Nodes** with QR verification, and measure the environmental impact of reuse — all from a screen designed for your phone.

> A physical infrastructure where local hardware circulates between makers, students and hubs. Take a photo, match it, pick it up in your city.

---

## The problem it solves

E-waste is growing faster than any other waste stream. At the same time, thousands of makers, robotics clubs, technical schools and community workshops need parts (ESP32, A4988 drivers, servos, ATX power supplies, sensors) that end up thrown in drawers or containers.

LOOP closes that cycle by attacking four concrete frictions:

| Friction | How it shows up |
|---|---|
| **Import delays** | A small component can take weeks and cost a lot in shipping. |
| **Idle hardware** | Boards and sensors sit in drawers while the city imports the same thing. |
| **E-waste** | Useful equipment gets discarded instead of going back into the circuit. |
| **Prototyping barriers** | Makers and students get stuck on a part they could find in their city. |

### Value proposition

A **local circular market with global operation**: physical infrastructure (Nodes) + AI matching + zero technical friction (take a photo and it matches) + trust (Maker Score) + traceable environmental impact.

| | LOOP |
|---|---|
| **Focus** | Real hardware reuse, not purchasing |
| **Unit** | The physical pickup Node (school / workshop / maker space) |
| **Trust** | Maker Score + Node-verified listings + QR |
| **Data** | Quantifiable, traceable environmental impact metrics |
| **Access** | 100% mobile-first, camera + voice + generative AI |

---

## Key Features

The features are **implemented in the code** of this repository (`src/routes`, `src/components/loop`, `src/lib`) and map to the five pillars of the pitch deck.

### 1. Identify — AI hardware identification (*Add* tab · Offer)
- Multi-photo upload + camera capture (`capture="environment"`) (`src/routes/agregar.tsx`).
- **Gemini Vision** (via Lovable AI Gateway) reads the photo and auto-fills name, category, condition and technical tags (`src/lib/vision.functions.ts`, `src/lib/autotags.ts`).
- Extraction of technical terms (ESP32, Arduino, A4988…) with Spanish stopword filtering.

### 2. Discovery — Map, voice and BOM matcher (*Map* + *Projects* tabs)
- Real map with `react-leaflet` + CartoDB Voyager tiles (`src/components/loop/MapView.tsx`).
- **Blue pins (#009DFF)** for *Offer* and **orange pins (#FF8C00)** for *Need*.
- **Voice & natural language** (Web Speech API): *"I need a stepper motor and a driver for a small arm"*.
- **BOM matcher**: maker projects with a bill of materials matched against the local inventory at once (`src/lib/loop-projects.ts`, `src/routes/proyectos.tsx`).
- Collapsible filters by category, **proximity radius (Haversine)** and *"Node-verified only"* switch; dynamic tags in a horizontal scroll extracted from real stock.
- Bottom sheet with mini-preview and full detail + zoom lightbox (`ListingDetail.tsx`, `Lightbox.tsx`).

### 3. Logistics — Secure Nodes and QR escrow
- Network of **demo Nodes** (Nodo Tecnológico Norte, Hub de Innovación Central, Campus Maker Comunitario, Centro de Tecnología Aplicada) as local, secure exchange points (`src/lib/loop-nodes.ts`).
- *Pick up at Secure Node* button that generates a **Pickup Pass with QR** confirming identity, origin and condition at pickup (`src/components/loop/PickupPass.tsx`).

### 4. Trust — Reputation and Maker Score (*Profile* tab)
- **Maker Score** in the Uber/Airbnb style, built on real completed handoffs (`src/lib/loop-reputation.ts`, `src/routes/perfil.tsx`).
- Community validation, traceable handoff history, verified identity and badges (Recycler, Founder).

### 5. Impact — Measurable circular economy
- **Environmental impact metrics**: kg of e-waste avoided, CO₂ offset, community savings in ARS and parts reinserted (`src/lib/loop-impact.ts`).
- Sustainability report per Node and per project; every reuse is traceable.

### Feed & Activity (*Activity* tab)
- News timeline grouped into *Today*, *This week*, *Last month* with a *View on map* action that centers the map and opens the detail (`src/routes/actividad.tsx`).

### Settings & Account (*Settings* tab)
- Account info, **dark/light toggle**, preferences and notifications.
- **Spanish / English language switcher** with persistent global state that re-renders the whole app instantly (`src/lib/i18n.tsx`).
- Quick *Demo Mode (Juror / Guest)* access on the login screen (`src/components/loop/GoogleGate.tsx`).

### Design system
- **Instrument Sans** typography (Google Fonts).
- Palette: light background `#F8F9FA`, Electric Blue `#009DFF` (Offer), Vibrant Orange `#FF8C00` (Need).
- Iconography with **Remix Icon** (`@remixicon/react`) and category → icon + color mapping (`src/lib/category-icons.tsx`).
- Sticky header with an always-visible close button in the detail view.

---

## Business model and roadmap

### Business model (sustainability)
- **B2B / B2G**: work with hubs and institutions to supply local Nodes.
- **Logistics fee**: a small fee on Node logistics funds the network and keeps the circuit active.
- **Component sponsorship**: companies return surplus hardware to the community.

### Roadmap
1. **Local sandbox** — first community Nodes and a pilot maker base.
2. **Regional / country expansion** — technical hubs across the region and country.
3. **Programmable escrow** — contracts and escrow for secure exchange.

> The demo impact values are illustrative. The model is designed to measure real e-waste avoided once the network is operational.

---

## Architecture and Tech Stack

LOOP is built on **TanStack Start v1** with SSR/SSG and Vite 8, deployable as an Edge function (Cloudflare Workers). App state lives in a React `Context` with `localStorage` persistence.

```
┌─────────────────────────────────────────────┐
│  src/routes/__root.tsx                       │  Shell + providers
│   ├─ QueryClientProvider (TanStack Query)    │
│   ├─ I18nProvider (ES/EN)                    │
│   └─ LoopProvider (state + persistence)      │
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

### Real dependencies (from `package.json`)

| Category | Packages |
|---|---|
| **Framework** | `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-query` |
| **Build** | `vite` 8, `nitro`, `@lovable.dev/vite-tanstack-config`, `@vitejs/plugin-react` |
| **UI / Styles** | `tailwindcss` v4, `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge`, `vaul` (bottom sheets) |
| **UI primitives** | `@radix-ui/*` (dialog, tabs, switch, slider, popover, etc.), `cmdk`, `sonner` (toasts) |
| **Iconography** | `@remixicon/react` (Remix Icon), `lucide-react` |
| **Map** | `leaflet`, `react-leaflet`, `@types/leaflet` |
| **Forms / Validation** | `react-hook-form`, `@hookform/resolvers`, `zod` |
| **Data / Dates / Charts** | `date-fns`, `recharts` |
| **Media** | `embla-carousel-react`, `react-day-picker`, `input-otp`, `react-resizable-panels` |
| **Core** | `react` 19, `react-dom` 19, `typescript` 5.8 |

> Language: strict **TypeScript**. Linting: **ESLint** + **Prettier**.

### Server functions & boundaries
- `createServerFn` (from `@tanstack/react-start`) for server logic.
- Image analysis with **Gemini Vision** is invoked from `src/lib/vision.functions.ts` through the Lovable AI Gateway.
- The Edge runtime (`nodejs_compat`) supports `crypto`, `fetch`, `stream`, etc. No Node-only native dependencies are used.

---

## Quick start — run the project locally

### Requirements
- **Node.js** 20+ (recommended via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **bun** or **npm**

### Steps

```bash
# 1. Clone the repository
git clone 🔗 view-link.cx/RBXNdbEWBbW
cd loop-build

# 2. Install dependencies
bun install   # (or: npm install)

# 3. Start the dev server (Vite)
bun dev       # (or: npm run dev)
```

The app is available at `http://localhost:8080` (or whichever port Vite reports).

### Available scripts

| Script | Description |
|---|---|
| `bun dev` / `npm run dev` | Dev server with HMR |
| `bun run build` / `npm run build` | Production build (`vite build`) |
| `bun run build:dev` / `npm run build:dev` | Development-mode build |
| `bun run preview` / `npm run preview` | Preview the production build |
| `bun run lint` / `npm run lint` | Run ESLint |
| `bun run format` / `npm run format` | Format code with Prettier |

### First run

The app ships **seeded with 14 realistic listings** (`src/lib/loop-data.ts`) including ESP32, A4988 drivers, ATX power supplies, MG996R servos, Arduino Uno, DHT22 sensors, NEMA 17, Raspberry Pi and more. On first load you'll see the populated map, the activity feed and the profile with metrics.

To try the full flow without Google Sign-in, use the **"Ingresar en Modo Demo (Jurado / Invitado)"** button on the login screen.

---

## Project structure

```
src/
├── routes/                 # File-based routes (TanStack Router)
│   ├── __root.tsx          # Shell + providers + global <head>
│   ├── index.tsx           # Map tab
│   ├── actividad.tsx       # Activity tab (feed)
│   ├── agregar.tsx         # Add tab (Offer/Need + AI)
│   ├── perfil.tsx          # Profile tab (reputation + impact)
│   ├── ajustes.tsx         # Settings tab (account, theme, language)
│   └── proyectos.tsx       # Maker projects / BOM
├── components/loop/        # LOOP domain components
│   ├── AppShell.tsx        # 5-tab bottom navigation
│   ├── GoogleGate.tsx      # Login / welcome + Demo Mode
│   ├── MapView.tsx         # Interactive Leaflet map
│   ├── ListingDetail.tsx   # Detail bottom sheet
│   ├── Lightbox.tsx        # Image zoom
│   └── PickupPass.tsx      # QR pickup pass
├── lib/                    # Domain logic
│   ├── loop-data.ts        # Types, seed data, helpers (Haversine, buckets)
│   ├── loop-store.tsx      # State context + localStorage persistence
│   ├── loop-impact.ts      # Environmental metrics (e-waste, CO₂, ARS)
│   ├── loop-nodes.ts       # Demo physical pickup Nodes
│   ├── loop-projects.ts    # Maker projects + BOM matcher
│   ├── loop-reputation.ts  # Maker Score, badges and reviews
│   ├── autotags.ts         # Technical tag extraction + ES stopwords
│   ├── category-icons.tsx  # Category → icon/color mapping
│   ├── i18n.tsx            # Provider + ES/EN dictionary
│   └── vision.functions.ts# Gemini Vision server fn
├── components/ui/          # shadcn/ui primitives (new-york)
└── styles.css              # Design system (Tailwind v4 + oklch)
```

---

## Team

Developed by the LOOP co-founders for the hackathon:

- **Facundo Romero** — Lead AI Builder & Product Strategy
- **Maria Gisel Chavez** — Product, Outreach & Project Operations

> *Build. Learn. Reuse. Repeat. — Keep technology in motion.*

---

*This project was built with [Lovable](https://lovable.dev).*

---
---

# LOOP · Hardware circular para makers

**Build. Learn. Reuse. Repeat. — Keep technology in motion.**

**Pitch deck** · [PDF en Google Drive](https://drive.google.com/file/d/1xe5w5yhfGZjatRnOtHoL_OUIs5cucGCm/view) · **Video pitch** · [YouTube](https://www.youtube.com/watch?v=Pk_kuXanXTg)

LOOP es una aplicación *mobile-first* que funciona como **mercado circular de hardware y red comunitaria para makers**. Permite identificar componentes con IA, ofrecerlos o solicitarlos, organizar retiros en **Nodos seguros** con verificación QR y medir el impacto ambiental de la reutilización — todo desde una pantalla pensada para celular.

> Una infraestructura física donde el hardware local circula entre makers, estudiantes y hubs. Toma una foto, matcheala, retirala en tu ciudad.

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
- **bun** o **npm**

### Pasos

```bash
# 1. Clonar el repositorio
git clone 🔗 view-link.cx/RBXNdbEWBbW
cd loop-build

# 2. Instalar dependencias
bun install   # (o: npm install)

# 3. Levantar el servidor de desarrollo (Vite)
bun dev       # (o: npm run dev)
```

La app queda disponible en `http://localhost:8080` (o el puerto que informe Vite).

### Scripts disponibles

| Script | Descripción |
|---|---|
| `bun dev` / `npm run dev` | Servidor de desarrollo con HMR |
| `bun run build` / `npm run build` | Build de producción (`vite build`) |
| `bun run build:dev` / `npm run build:dev` | Build en modo development |
| `bun run preview` / `npm run preview` | Previsualiza el build de producción |
| `bun run lint` / `npm run lint` | Ejecuta ESLint |
| `bun run format` / `npm run format` | Formatea el código con Prettier |

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
│   └── proyectos.tsx       # Proyectos maker / BOM
├── components/loop/        # Componentes de dominio LOOP
│   ├── AppShell.tsx        # Navegación inferior de 5 tabs
│   ├── GoogleGate.tsx      # Login / bienvenida + Modo Demo
│   ├── MapView.tsx         # Mapa Leaflet interactivo
│   ├── ListingDetail.tsx   # Bottom sheet de detalle
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
│   ├── category-icons.tsx  # Mapeo categoría → icono/color
│   ├── i18n.tsx            # Provider + diccionario ES/EN
│   └── vision.functions.ts # Server fn Gemini Vision
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
