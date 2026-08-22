import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RiCameraLine as Camera, RiMicLine as Mic, RiSparkling2Line as Sparkles, RiArrowRightLine as ArrowRight, RiArrowLeftLine as ArrowLeft } from "@remixicon/react";
import { AppShell } from "@/components/loop/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLoop } from "@/lib/loop-store";
import { toast } from "sonner";

export const Route = createFileRoute("/agregar")({
  head: () => ({
    meta: [
      { title: "Publicar hardware · LOOP" },
      {
        name: "description",
        content: "Ofrecé componentes o pedí las piezas que te faltan con análisis asistido por IA.",
      },
      { property: "og:title", content: "Publicar hardware · LOOP" },
      { property: "og:description", content: "Ofrezco o Necesito: publicá en el mapa maker." },
    ],
  }),
  component: AgregarPage,
});

type Step = "intent" | "ofrezco" | "necesito";

const DETECTIONS = [
  {
    title: "ESP32 DevKit V1",
    category: "Microcontroladores",
    status: "Operativo - Pines sanos",
    description:
      "Placa de desarrollo ESP32 con WiFi 2.4 GHz y Bluetooth. Regulador AMS1117 en buen estado, headers completos.",
    tags: ["ESP32", "WiFi", "IoT", "3.3V"],
    emoji: "🧠",
  },
  {
    title: "Driver A4988",
    category: "Drivers y motores",
    status: "Operativo - Con disipador",
    description:
      "Driver de motor paso a paso A4988 con potenciómetro de corriente funcional y disipador adherido.",
    tags: ["A4988", "Stepper", "CNC"],
    emoji: "⚙️",
  },
  {
    title: "Fuente ATX 500W",
    category: "Alimentación",
    status: "Operativo - Testeada",
    description:
      "Fuente conmutada ATX con salidas 12V, 5V y 3.3V. Apta para convertir en fuente de banco.",
    tags: ["ATX", "12V", "Fuente"],
    emoji: "🔌",
  },
];

function AgregarPage() {
  const [step, setStep] = useState<Step>("intent");

  return (
    <AppShell>
      <div className="space-y-4 p-4">
        {step !== "intent" && (
          <button
            onClick={() => setStep("intent")}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </button>
        )}

        {step === "intent" && <IntentStep onPick={setStep} />}
        {step === "ofrezco" && <OfrezcoStep />}
        {step === "necesito" && <NecesitoStep />}
      </div>
    </AppShell>
  );
}

function IntentStep({ onPick }: { onPick: (s: Step) => void }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">¿Qué querés publicar?</h1>

      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid h-36 place-items-center bg-primary/10 text-5xl">📦</div>
        <div className="space-y-2 p-4">
          <h2 className="text-xl font-bold">Ofrezco…</h2>
          <p className="text-sm text-muted-foreground">
            Tengo componentes, placas o chatarra electrónica para donar o intercambiar.
          </p>
          <div className="flex justify-end">
            <Button className="rounded-full" onClick={() => onPick("ofrezco")}>
              Ofrecer <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>

      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid h-36 place-items-center bg-accent/15 text-5xl">🔎</div>
        <div className="space-y-2 p-4">
          <h2 className="text-xl font-bold">Necesito…</h2>
          <p className="text-sm text-muted-foreground">
            Busco piezas para armar un proyecto maker o de robótica.
          </p>
          <div className="flex justify-end">
            <Button variant="secondary" className="rounded-full" onClick={() => onPick("necesito")}>
              Necesito <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}

function OfrezcoStep() {
  const { addListing } = useLoop();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [detected, setDetected] = useState<(typeof DETECTIONS)[number] | null>(null);
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState("");
  const [zone, setZone] = useState("Microcentro");
  const fileRef = useRef<HTMLInputElement>(null);

  const capture = () => {
    const next = DETECTIONS[photos.length % DETECTIONS.length]!;
    setPhotos((p) => [...p, next.emoji]);
    setAnalyzing(true);
    setTimeout(() => {
      setDetected(next);
      setAnalyzing(false);
    }, 1400);
  };

  const publish = () => {
    if (!detected) return;
    addListing({
      intent: "ofrezco",
      title: detected.title,
      category: detected.category,
      status: detected.status,
      description: notes ? `${detected.description} Notas: ${notes}` : detected.description,
      tags: detected.tags,
      zone,
      contact: {
        type: contact.includes("@") ? "email" : "whatsapp",
        value: contact || "+54 387 000 0000",
      },
      owner: "Vos",
      quantity: 1,
      emoji: detected.emoji,
    });
    toast.success("Publicado en el mapa con pin azul");
    navigate({ to: "/" });
  };

  return (
    <div className="space-y-4">
      <div className="grid h-56 place-items-center rounded-2xl border border-border bg-muted text-6xl">
        {photos.length ? photos[photos.length - 1] : "📷"}
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2">
          {photos.map((p, i) => (
            <span key={i} className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-xl">
              {p}
            </span>
          ))}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={capture} />
      <Button className="w-full rounded-2xl py-6 text-base" onClick={capture}>
        <Camera className="mr-2 h-5 w-5" /> Tomar fotografía
      </Button>
      <Button variant="outline" className="w-full rounded-2xl" onClick={() => fileRef.current?.click()}>
        Subir desde galería
      </Button>

      <div>
        <h2 className="text-xl font-bold">Sacá una foto</h2>
        <p className="text-sm text-muted-foreground">
          Apuntá directamente a lo que estás ofreciendo; mientras más fotografías en diferentes
          ángulos, mejor.
        </p>
      </div>

      {analyzing && (
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm shadow-sm">
          <Sparkles className="h-4 w-4 animate-pulse text-primary" />
          Analizando componente con visión IA…
        </div>
      )}

      {detected && !analyzing && (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-4 w-4" /> Detectado por IA
          </p>
          <p className="text-lg font-bold">{detected.title}</p>
          <p className="text-sm text-muted-foreground">
            {detected.category} · {detected.status}
          </p>
          <p className="text-sm">{detected.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {detected.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas adicionales (estado, accesorios, horarios de entrega)…"
        className="min-h-24 rounded-2xl"
      />
      <Input
        value={zone}
        onChange={(e) => setZone(e.target.value)}
        placeholder="Zona aproximada"
        className="rounded-2xl"
      />
      <Input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Email / Teléfono / WhatsApp"
        className="rounded-2xl"
      />
      <Button className="w-full rounded-full" disabled={!detected} onClick={publish}>
        Publicar
      </Button>
    </div>
  );
}

function NecesitoStep() {
  const { addListing } = useLoop();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [refined, setRefined] = useState<{ title: string; category: string; tags: string[] } | null>(
    null,
  );

  useEffect(() => {
    if (text.trim().length < 12) {
      setRefined(null);
      return;
    }
    const id = setTimeout(() => {
      const t = text.toLowerCase();
      const category = t.includes("servo")
        ? "Servomotores"
        : t.includes("sensor")
          ? "Sensores"
          : t.includes("fuente") || t.includes("bateria") || t.includes("batería")
            ? "Alimentación"
            : t.includes("motor") || t.includes("driver")
              ? "Drivers y motores"
              : "Microcontroladores";
      const title = (text.trim().split(/[.,\n]/)[0] ?? text.trim()).slice(0, 48);
      setRefined({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        category,
        tags: Array.from(new Set(t.split(/\s+/).filter((w) => w.length > 4))).slice(0, 4),
      });
    }, 900);
    return () => clearTimeout(id);
  }, [text]);

  const dictate = () => {
    setListening(true);
    setTimeout(() => {
      setText(
        "Necesito 4 servos MG996R y un driver PCA9685 para armar un brazo robótico con los chicos del taller.",
      );
      setListening(false);
    }, 1500);
  };

  const publish = () => {
    if (!refined) return;
    addListing({
      intent: "necesito",
      title: refined.title,
      category: refined.category,
      status: "Buscando componentes",
      description: text,
      tags: refined.tags,
      zone: "Zona sin especificar",
      contact: { type: "whatsapp", value: "+54 387 000 0000" },
      owner: "Vos",
      quantity: 1,
      emoji: "🔎",
    });
    toast.success("Publicado en el mapa con pin naranja");
    navigate({ to: "/" });
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl border border-border bg-muted p-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Necesito un…"
          className="min-h-56 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
        <button
          onClick={dictate}
          aria-label="Dictado por voz"
          className={`absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-border bg-background ${
            listening ? "animate-pulse text-accent" : "text-muted-foreground"
          }`}
        >
          <Mic className="h-4 w-4" />
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold">Describí lo que necesitás</h2>
        <p className="text-sm text-muted-foreground">
          Mientras más detalles agregues, mejores resultados de búsqueda obtendrás.
        </p>
      </div>

      {refined && (
        <div className="space-y-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
            <Sparkles className="h-4 w-4" /> Refinado por IA
          </p>
          <p className="font-bold">{refined.title}</p>
          <p className="text-sm text-muted-foreground">Categoría: {refined.category}</p>
          <div className="flex flex-wrap gap-1.5">
            {refined.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

      <Button
        variant="secondary"
        className="w-full rounded-full"
        disabled={!refined}
        onClick={publish}
      >
        Continuar
      </Button>
    </div>
  );
}
