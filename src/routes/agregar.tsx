import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  RiCameraLine as Camera,
  RiImageAddLine as ImageAdd,
  RiMicLine as Mic,
  RiSparkling2Line as Sparkles,
  RiArrowRightLine as ArrowRight,
  RiArrowLeftLine as ArrowLeft,
  RiLoader4Line as Loader,
} from "@remixicon/react";
import { AppShell } from "@/components/loop/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLoop } from "@/lib/loop-store";
import { categoryStyle } from "@/lib/category-icons";
import { analyzeComponent, type VisionResult } from "@/lib/vision.functions";
import { extractTags } from "@/lib/autotags";
import { Lightbox } from "@/components/loop/Lightbox";
import { toast } from "sonner";

import ofrezcoImg from "@/assets/ofrezco.jpg.asset.json";
import necesitoImg from "@/assets/necesito.jpg.asset.json";

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

/** Downscale + compress an image file into a data URL suitable for the vision model. */
function fileToDataUrl(file: File, max = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Archivo de imagen inválido."));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

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
        <img
          src={ofrezcoImg.url}
          alt="Componentes electrónicos ofrecidos"
          className="h-36 w-full object-cover"
          loading="lazy"
        />
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
        <img
          src={necesitoImg.url}
          alt="Manos armando un circuito en protoboard"
          className="h-36 w-full object-cover"
          loading="lazy"
        />
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
  const [detected, setDetected] = useState<VisionResult | null>(null);
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState("");
  const [zone, setZone] = useState("Microcentro");
  const [zoom, setZoom] = useState<string | null>(null);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhotos((p) => [...p, dataUrl]);
      setAnalyzing(true);
      const result = await analyzeComponent({ data: { imageDataUrl: dataUrl, intent: "ofrezco" } });
      setDetected(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo analizar la imagen.");
    } finally {
      setAnalyzing(false);
    }
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
      ...(photos[0] ? { photo: photos[0] } : {}),
    });
    toast.success("Publicado en el mapa con pin azul");
    navigate({ to: "/" });
  };

  const style = detected ? categoryStyle(`${detected.category} ${detected.title}`) : null;

  return (
    <div className="space-y-4">
      <Lightbox src={zoom} alt="Foto del componente" onClose={() => setZoom(null)} />
      <div className="grid h-56 place-items-center overflow-hidden rounded-2xl border border-border bg-muted">
        {photos.length ? (
          <img
            src={photos[photos.length - 1]}
            alt="Foto del componente"
            onClick={() => setZoom(photos[photos.length - 1] ?? null)}
            className="h-full w-full cursor-zoom-in object-cover"
          />
        ) : (
          <Camera className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((p, i) => (
            <img
              key={i}
              src={p}
              alt=""
              onClick={() => setZoom(p)}
              className="h-12 w-12 shrink-0 cursor-zoom-in rounded-xl object-cover"
            />
          ))}
        </div>
      )}


      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <Button
        className="w-full rounded-2xl py-6 text-base"
        disabled={analyzing}
        onClick={() => cameraRef.current?.click()}
      >
        <Camera className="mr-2 h-5 w-5" /> Tomar fotografía
      </Button>
      <Button
        variant="outline"
        className="w-full rounded-2xl"
        disabled={analyzing}
        onClick={() => galleryRef.current?.click()}
      >
        <ImageAdd className="mr-2 h-4 w-4" /> Subir desde galería
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
          <Loader className="h-4 w-4 animate-spin text-primary" />
          Analizando componente con visión IA…
        </div>
      )}

      {detected && style && !analyzing && (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-4 w-4" /> Detectado por IA
          </p>
          <p className="text-lg font-bold">{detected.title}</p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${style.badge}`}>
              <style.Icon className="h-3.5 w-3.5" /> {detected.category}
            </span>
            · {detected.status}
          </p>
          <p className="text-sm">{detected.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {detected.tags.map((t) => (
              <span
                key={t}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${style.badge}`}
              >
                <style.Icon className="h-3 w-3" /> {t}
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
      <Button className="w-full rounded-full" disabled={!detected || analyzing} onClick={publish}>
        Publicar
      </Button>
    </div>
  );
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
}

function NecesitoStep() {
  const { addListing } = useLoop();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [refined, setRefined] = useState<{ title: string; category: string; tags: string[] } | null>(
    null,
  );
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
        tags: extractTags(text, 4),
      });
    }, 900);
    return () => clearTimeout(id);
  }, [text]);

  const dictate = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      toast.error("Tu navegador no soporta dictado por voz. Escribí el pedido a mano.");
      return;
    }
    const rec = new Ctor();
    rec.lang = "es-AR";
    rec.continuous = true;
    rec.interimResults = true;

    // Texto ya escrito antes de empezar a dictar (nunca se reprocesa).
    const base = text.trim();
    let finalText = "";

    rec.onresult = (e: any) => {
      let interim = "";
      // Solo se recorren los resultados nuevos desde resultIndex.
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = String(e.results[i][0].transcript).trim();
        if (!transcript) continue;
        if (e.results[i].isFinal) {
          finalText = `${finalText} ${transcript}`.trim();
        } else {
          interim = `${interim} ${transcript}`.trim();
        }
      }
      const next = [base, finalText, interim].filter(Boolean).join(" ").replace(/\s+/g, " ");
      setText(next);
    };
    rec.onerror = () => {
      toast.error("No se pudo acceder al micrófono.");
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };


  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setPhoto(await fileToDataUrl(file));
    } catch {
      toast.error("No se pudo leer la imagen.");
    }
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
      ...(photo ? { photo } : {}),
    });
    toast.success("Publicado en el mapa con pin naranja");
    navigate({ to: "/" });
  };

  const style = refined ? categoryStyle(`${refined.category} ${refined.title}`) : null;

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
          className={`absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-border ${
            listening ? "animate-pulse bg-accent text-accent-foreground" : "bg-background text-muted-foreground"
          }`}
        >
          <Mic className="h-4 w-4" />
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <Lightbox src={zoom} alt="Referencia del proyecto" onClose={() => setZoom(null)} />
      {photo && (
        <img
          src={photo}
          alt="Referencia del proyecto"
          onClick={() => setZoom(photo)}
          className="h-40 w-full cursor-zoom-in rounded-2xl object-cover"
        />
      )}

      <Button variant="outline" className="w-full rounded-2xl" onClick={() => fileRef.current?.click()}>
        <ImageAdd className="mr-2 h-4 w-4" /> Adjuntar foto / referencia
      </Button>

      <div>
        <h2 className="text-xl font-bold">Describí lo que necesitás</h2>
        <p className="text-sm text-muted-foreground">
          Mientras más detalles agregues, mejores resultados de búsqueda obtendrás.
        </p>
      </div>

      {refined && style && (
        <div className="space-y-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
            <Sparkles className="h-4 w-4" /> Refinado por IA
          </p>
          <p className="font-bold">{refined.title}</p>
          <p className="text-sm text-muted-foreground">Categoría: {refined.category}</p>
          <div className="flex flex-wrap gap-1.5">
            {refined.tags.map((t) => (
              <span
                key={t}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${style.badge}`}
              >
                <style.Icon className="h-3 w-3" /> {t}
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
