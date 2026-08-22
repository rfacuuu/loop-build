import { RiCloseLine } from "@remixicon/react";
import { useEffect } from "react";

export function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string | null;
  alt?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt ?? "Imagen ampliada"}
      className="fixed inset-0 z-[200] grid place-items-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Cerrar imagen"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
      >
        <RiCloseLine className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt={alt ?? ""}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
      />
    </div>
  );
}
