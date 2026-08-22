import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { timeAgo, type Listing } from "@/lib/loop-data";
import { categoryStyle } from "@/lib/category-icons";
import { useState } from "react";

export function ListingSheet({
  listing,
  onOpenChange,
}: {
  listing: Listing | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [full, setFull] = useState(false);
  if (!listing) return null;
  const accent = listing.intent === "ofrezco" ? "text-primary" : "text-accent";
  const { Icon, tile, badge } = categoryStyle(`${listing.category} ${listing.title}`);

  return (
    <Sheet
      open={!!listing}
      onOpenChange={(o) => {
        if (!o) setFull(false);
        onOpenChange(o);
      }}
    >
      <SheetContent side="bottom" className="mx-auto max-w-md overflow-y-auto rounded-t-3xl border-border">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Icon className="h-5 w-5 shrink-0" /> {listing.title}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-8">
          {listing.photo ? (
            <img
              src={listing.photo}
              alt={listing.title}
              className="h-40 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className={`grid h-36 place-items-center rounded-2xl ${tile}`}>
              <Icon className="h-14 w-14" />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge variant={listing.intent === "ofrezco" ? "default" : "secondary"} className="rounded-full">
              {listing.intent === "ofrezco" ? "Ofrezco" : "Necesito"}
            </Badge>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badge}`}>
              <Icon className="h-3.5 w-3.5" /> {listing.category}
            </span>
            <Badge variant="outline" className="rounded-full">
              {listing.zone}
            </Badge>
          </div>
          <p className={`text-sm font-medium ${accent}`}>{listing.status}</p>
          <p className="text-sm text-muted-foreground">{listing.description}</p>

          {full ? (
            <div className="space-y-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
              <Row label="Publicado por" value={listing.owner} />
              <Row label="Cantidad" value={`${listing.quantity} unidad(es)`} />
              <Row label="Publicado" value={timeAgo(listing.createdAt)} />
              <Row label="Nodo asignado" value={listing.zone} />
              <Row label="Zona aproximada" value={`${listing.zone} (radio ~500 m)`} />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {listing.tags.map((t) => (
                  <span
                    key={t}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${badge}`}
                  >
                    <Icon className="h-3 w-3" /> {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <Button variant="outline" className="w-full rounded-full" onClick={() => setFull(true)}>
              Ver detalle completo
            </Button>
          )}

          <Button className="w-full rounded-full" variant={listing.intent === "ofrezco" ? "default" : "secondary"}>
            {listing.contact.type === "whatsapp" ? "WhatsApp · " : "Email · "}
            {listing.contact.value}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
