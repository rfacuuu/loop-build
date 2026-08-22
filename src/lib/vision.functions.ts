import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  imageDataUrl: z.string().min(32),
  intent: z.enum(["ofrezco", "necesito"]).default("ofrezco"),
});

export interface VisionResult {
  title: string;
  category: string;
  status: string;
  description: string;
  tags: string[];
}

export const analyzeComponent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<VisionResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    const base = process.env["AGW_URL"] ?? "https://ai.gateway.lovable.dev";
    if (!apiKey) throw new Error("Falta la configuración de la IA (LOVABLE_API_KEY).");

    const res = await fetch(`${base.replace(/\/$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-3-flash",
        messages: [
          {
            role: "system",
            content:
              "Sos un perito en electrónica. Analizás fotos de componentes de hardware y devolvés SOLO JSON válido con las claves: title (string corto), category (una de: Microcontroladores, Sensores, Drivers y motores, Servomotores, Alimentación, Displays, Componentes pasivos, Chatarra electrónica, Prototipado, Automatización, Computadoras SBC), status (estado aparente en pocas palabras, en español), description (2 oraciones en español), tags (array de 3 a 5 strings cortos). Sin markdown ni texto extra.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  data.intent === "ofrezco"
                    ? "Identificá el componente ofrecido en esta foto."
                    : "Identificá el componente de referencia que se busca en esta foto.",
              },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("La IA está saturada, probá de nuevo en unos segundos.");
      if (res.status === 402) throw new Error("Se agotaron los créditos de IA del proyecto.");
      throw new Error(`Error de la IA (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No se pudo interpretar la respuesta de la IA.");
    const parsed = JSON.parse(match[0]) as Partial<VisionResult>;

    return {
      title: parsed.title?.trim() || "Componente electrónico",
      category: parsed.category?.trim() || "Componentes pasivos",
      status: parsed.status?.trim() || "Estado a confirmar",
      description: parsed.description?.trim() || "Componente detectado a partir de la fotografía.",
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5).map(String) : [],
    };
  });
