# LOOP · Hardware circular para makers

**Build. Learn. Reuse. Repeat. Keep technology in motion.**

LOOP es una aplicación *mobile-first* que funciona como **mercado circular de hardware y red comunitaria para makers**. Permite ofrecer componentes electrónicos sobrantes o rescatados de e-waste, publicar necesidades de piezas para proyectos maker, organizar retiros en **Nodos seguros** y medir el impacto ambiental de la reutilización — todo desde una sola pantalla pensada para celular.

> Red de componentes electrónicos para la comunidad maker: ofrecé y encontrá piezas cerca tuyo, mantené la tecnología en movimiento.

---

## El problema que resuelve

La basura electrónica crece más rápido que cualquier otro flujo de residuos. Al mismo tiempo, miles de makers, clubes de robótica, escuelas técnicas y talleres comunitarios necesitan piezas (ESP32, drivers A4988, servos, fuentes ATX, sensores) que terminan tiradas en cajones o en contenedores.

LOOP cierra ese ciclo conectando oferta y demanda de hardware a nivel barrial:

- **Quien tiene** placas, chatarra o componentes que ya no usa puede donarlos o intercambiarlos.
- **Quien necesita** piezas para un proyecto maker las encuentra en un mapa local y gestiona el retiro en un Nodo seguro.
- **La comunidad** gana visibilidad del impacto: kg de e-waste evitado, CO₂ compensado y ahorro comunitario.

### Propuesta de valor

| | LOOP |
|---|---|
| **Foco** | Reutilización real de hardware, no compra |
| **Unidad** | El Nodo físico de retiro (escuela/taller/maker space) |
| **Confianza** | Reputación estilo Uber + publicaciones verificadas en Nodo |
| **Datos** | Métricas de impacto ambiental cuantificables |
| **Acceso** | 100 % mobile-first, cámara + voz + IA generativa |

---

## Features principales

Las features listadas a continuación están **implementadas en el código** de este repositorio (`src/routes`, `src/components/loop`, `src/lib`).

### 🗺️ Mapa interactivo (Tab *Mapa*)
- Mapa real con `react-leaflet` + tiles CartoDB Voyager (`src/components/loop/MapView.tsx`).
- **Pins azules (#009DFF)** para *Ofrezco* y **pins naranjas (#FF8C00)** para *Necesito*.
- Bottom sheet con mini-preview y detalle completo del componente (`ListingDetail.tsx`).
- **Filtros colapsables** por categoría, radio de cercanía (Haversine) y switch *"solo verificados en Nodo"*.
- **Tags dinámicos** de categoría en scroll horizontal, extraídos del stock real.
- Búsqueda por texto y centrado del mapa con animación `flyTo` desde el feed.

### 📰 Actividad (Tab *Actividad*)
- Timeline/feed de novedades agrupado en buckets: *Hoy*, *Esta semana*, *El mes pasado* (`src/routes/actividad.tsx`).
- Tarjetas con tipo (ofrezco/necesito), cantidad de piezas y acción *Ver en el mapa*.

### ➕ Agregar / Publicar (Tab *Agregar*)
- Selección de intento: **Ofrezco** o **Necesito** (`src/routes/agregar.tsx`).
- **Ofrezco**: subida multi-foto + captura con cámara (`capture="environment"`), análisis con **Gemini Vision** (vía Lovable AI Gateway) que autocompleta nombre, categoría, estado y tags (`src/lib/vision.functions.ts`).
- **Necesito**: prompt de texto + **dictado por voz** (Web Speech API) + foto adjunta. Refinamiento automático con extracción de términos técnicos y filtrado de stopwords en español (`src/lib/autotags.ts`).

### 👤 Perfil & Reputación (Tab *Perfil*)
- Reputación estilo Uber/Airbnb con score promedio, badges y reseñas de comunidad (`src/lib/loop-reputation.ts`, `src/routes/perfil.tsx`).
- **Métricas de impacto ambiental**: kg de e-waste evitado, CO₂ compensado, ahorro comunitario en ARS y piezas reinsertadas (`src/lib/loop-impact.ts`).
- Secciones *Lo que necesito* / *Lo que ofrezco* con edición y borrado, abriendo el detalle en modal.

### 🗂️ Proyectos maker / BOM Matcher
- Creación de proyectos con lista de materiales (BOM) y búsqueda de piezas faltantes en el mapa (`src/lib/loop-projects.ts`, `src/routes/proyectos.tsx`).

### 🏪 Nodos físicos & Pase de retiro con QR
- Red de **Nodos demo** (Nodo Tecnológico Norte, Hub de Innovación Central, Campus Maker Comunitario, Centro de Tecnología Aplicada) identificados como *Punto de retiro LOOP demo* (`src/lib/loop-nodes.ts`).
- Botón *Retirar en Nodo Seguro* que genera un **Pase de Retiro con QR** mockeado (`src/components/loop/PickupPass.tsx`).

### ⚙️ Ajustes & Cuenta (Tab *Ajustes*)
- Información de cuenta, **toggle dark/light mode**, preferencias y notificaciones.
- **Switcher de idioma Español / English** con estado global persistente (`src/lib/i18n.tsx`) que re-renderiza toda la app al instante.
- Acceso rápido *Modo Demo (Jurado / Invitado)* en la pantalla de login (`src/components/loop/GoogleGate.tsx`).

### 🎨 Sistema de diseño
- Tipografía **Instrument Sans** (Google Fonts).
- Paleta: fondo claro `#F8F9FA`, Azul Eléctrico `#009DFF` (Ofrezco), Naranja Vibrante `#FF8C00` (Necesito).
- Iconografía con **Remix Icon** (`@remixicon/react`) y mapeo categoría → icono + color (`src/lib/category-icons.tsx`).
- Lightbox con zoom de imagen y header sticky en el detalle (`src/components/loop/Lightbox.tsx`).

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
│   ├── loop-reputation.ts  # Score, badges y reseñas
│   ├── autotags.ts         # Extracción de tags técnicos + stopwords ES
│   ├── category-icons.tsx  # Mapeo categoría → icono/color
│   ├── i18n.tsx            # Provider + diccionario ES/EN
│   └── vision.functions.ts# Server fn Gemini Vision
├── components/ui/          # Primitivos shadcn/ui (new-york)
└── styles.css              # Design system (Tailwind v4 + oklch)
```

---

## Créditos

Desarrollado por el equipo LOOP para la hackathon:

- **Facundo Romero**
- **Maria Gisel Chavez**

> *Build. Learn. Reuse. Repeat. — Keep technology in motion.*

---

*Este proyecto fue construido con [Lovable](https://lovable.dev).*
