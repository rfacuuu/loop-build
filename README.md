# LOOP

Build "LOOP", a mobile-first circular hardware marketplace and community network for makers in Salta, Argentina Slogan: "Build. Learn. Reuse. Repeat. Keep technology in motion."

 DESIGN SYSTEM & TYPOGRAPHY:

Typography: Use "Instrument Sans" (Google Fonts) across the entire app

Layout: 100% Mobile-first layout (clean container max-w-md mx-auto centered with smooth mobile app shell)

Palette: Light background (#F8F9FA), cards (#FFFFFF), subtle borders (#E5E7EB), Electric Blue (#009DFF) for "Ofrezco"/primary actions, Vibrant Orange (#FF8C00) for "Necesito"/accent actions

Style: Rounded pills (rounded-full), generous border radius (rounded-2xl) on cards, subtle elevation/shadows

Auth: Google Sign-in button ("Continuar con Google") to ensure verified unique identities

 BOTTOM NAVIGATION (5 TABS):

Mapa (Home / Explorer)

Actividad (Timeline / Feed de novedades)

Agregar / Publicar (Botón '+' central destacado)

Perfil (Reputación & Mis publicaciones)

Ajustes (Configuración & Cuenta)

 SCREENS & DETAILED FLOWS:

TAB 1: MAPA (EXPLORADOR LOCAL DE SALTA)

Interactive map centered in Salta Capital (E.E.T. N°3100, Puntos Digitales, UNSa, microcentro)

Map Pins with approximate location (privacy-first radius):

Blue pins (#009DFF): "Ofrezco" (hardware/scrap/components offered)

Orange pins (#FF8C00): "Necesito" (components requested for maker projects)

Pin Click: Opens a sleek bottom sheet mini-preview with component photo, title, category tag, approximate zone, and contact info (WhatsApp/Email badge). Clicking "Ver detalle completo" opens the full modal with all technical specs and notes

Pre-seed with 12+ realistic Salta hardware items (ESP32, drivers A4988, fuentes ATX, servos MG996R, Arduino Uno, sensores DHT22)

TAB 2: ACTIVIDAD (TIMELINE DE NOVEDADES)

Clean timeline/feed showing recent additions organized by time sections: "Hoy", "Esta semana", "El mes pasado"

Visual cards indicating if it was an offer or request, quantity of components saved from e-waste, and quick action to view on map

TAB 3: AGREGAR (INTENT SELECTION & AI FLOW)

Step 1: Two large distinct cards:

"Ofrezco" (Tengo componentes, placas o chatarra para donar/intercambiar)

"Necesito" (Busco piezas para armar un proyecto maker/robótica)

Step 2A (If Ofrezco):

Multi-photo uploader & direct camera capture UI

Simulated Gemini Vision analysis: auto-detects component name, category, detected status (e.g., "Operativo - Pines sanos"), auto-generates description and technical tags

Inputs for additional custom notes and contact info (Email / Teléfono / WhatsApp)

Step 2B (If Necesito):

Text prompt input ("¿Qué estás buscando armar o qué piezas te faltan?") + Voice dictation button (Speech-to-Text)

Background AI refinement: automatically cleans up the prompt, identifies required parts, categorizes them, and adds to the map with orange pin

Save everything to local state / database so it persists in the app

TAB 4: PERFIL (REPUTACIÓN UBER-STYLE)

User header: Avatar / initials, name, verified badge

Trust & Reputation Score: 4.9 ★ rating system (Uber/Airbnb style) showing completed handoffs and positive maker reviews

Two segmented tabs/sections:

"Lo que me interesa / Necesito" (Active project wishlist)

"Lo que ofrezco" (Active hardware listings with edit/delete options)

TAB 5: AJUSTES (CONFIGURACIÓN)

Google account profile info

Toggle Dark/Light mode

Preferences, Notifications, Terms & Privacy, and "Cerrar sesión"

Seed the app with rich, realistic Salta maker data so it looks 100% functional and production-grade on first load

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://loop-build.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e195189a-07b0-428b-896e-8e08475f772b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
