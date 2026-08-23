import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RiBuilding2Line, RiShieldCheckLine, RiTimeLine } from "@remixicon/react";
import { useMemo, useState } from "react";
import { LOOP_NODES, pickupCode, qrMatrix } from "@/lib/loop-nodes";
import { MAP_CENTER, distanceKm, type Listing } from "@/lib/loop-data";

function MockQr({ seed }: { seed: string }) {
  const grid = useMemo(() => qrMatrix(seed), [seed]);
  const size = grid.length;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Código QR de retiro ${seed}`}
      className="h-44 w-44 rounded-xl bg-white p-2 shadow-sm"
      shapeRendering="crispEdges"
    >
      {grid.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0B0F14" /> : null,
        ),
      )}
    </svg>
  );
}

export function PickupPassDialog({
  listing,
  open,
  onOpenChange,
}: {
  listing: Listing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const nodes = useMemo(
    () =>
      [...LOOP_NODES]
        .map((n) => ({
          ...n,
          km: distanceKm(
            typeof listing.lat === "number" && typeof listing.lng === "number"
              ? [listing.lat, listing.lng]
              : MAP_CENTER,
            [n.lat, n.lng],
          ),
        }))
        .sort((a, b) => a.km - b.km),
    [listing.lat, listing.lng],
  );
  const [nodeId, setNodeId] = useState(nodes[0]!.id);
  const node = nodes.find((n) => n.id === nodeId) ?? nodes[0]!;
  const code = pickupCode(listing.id, node.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto max-h-[88vh] max-w-md overflow-y-auto rounded-3xl">
        <DialogTitle className="flex items-center gap-2 text-lg">
          <RiShieldCheckLine className="h-5 w-5 text-primary" /> Pase de Retiro LOOP
        </DialogTitle>
        <DialogDescription className="text-xs">
          {listing.title} · {listing.quantity} unidad(es)
        </DialogDescription>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Elegí el Punto de retiro LOOP más cercano
          </p>
          <p className="text-[11px] text-muted-foreground">
            Ubicaciones demo de la red LOOP, no son sedes reales.
          </p>

          <div className="space-y-2">
            {nodes.map((n) => {
              const active = n.id === node.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNodeId(n.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                    active ? "border-primary bg-primary/10" : "border-border bg-card"
                  }`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <RiBuilding2Line className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{n.name}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {n.detail} · {n.zone}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                    {n.km.toFixed(1)} km
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-muted/40 p-4">
          <MockQr seed={code} />
          <p className="font-mono text-sm font-semibold tracking-wider">{code}</p>
          <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <RiTimeLine className="h-3.5 w-3.5" /> {node.hours}
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Mostrá este QR en el Nodo para certificar la entrega física y activar las 48 hs de
            garantía.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
