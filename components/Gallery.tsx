"use client";

import { useCallback, useRef, useState } from "react";
import { VehiclePhoto } from "@/components/VehiclePhoto";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { photoSrc } from "@/lib/photo";

type PhotoLike = { id: number; file: string; width: number; height: number; transparent: boolean };

export function Gallery({ photos, name, dimmed = false }: { photos: PhotoLike[]; name: string; dimmed?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(i, el.children.length - 1));
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  }, []);

  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (photos.length <= 1) {
    return (
      <div className="overflow-hidden rounded-[var(--radius-card)] bg-mist">
        <VehiclePhoto photo={photos[0]} alt={name} sizes="(min-width: 1024px) 640px, 100vw" priority className={`aspect-[4/3] w-full ${dimmed ? "opacity-60 grayscale" : ""}`} />
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-mist">
        <div
          ref={track}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          aria-roledescription="carrousel"
          aria-label={`Photos de la ${name}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
        >
          {photos.map((p, i) => (
            <div key={p.id} className="w-full shrink-0 snap-center" aria-label={`Photo ${i + 1} sur ${photos.length}`} role="group">
              <VehiclePhoto
                photo={p}
                alt={i === 0 ? name : `${name}, photo ${i + 1}`}
                sizes="(min-width: 1024px) 640px, 100vw"
                priority={i === 0}
                className={`aspect-[4/3] w-full ${dimmed ? "opacity-60 grayscale" : ""}`}
              />
            </div>
          ))}
        </div>

        <span className="absolute right-3 bottom-3 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-medium text-white tabular-nums">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="absolute top-1/2 left-3 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-card transition-opacity disabled:opacity-0 sm:grid"
          aria-label="Photo précédente"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === photos.length - 1}
          className="absolute top-1/2 right-3 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-card transition-opacity disabled:opacity-0 sm:grid"
          aria-label="Photo suivante"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5 sm:hidden" aria-hidden="true">
        {photos.map((p, i) => (
          <span key={p.id} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-ink" : "w-1.5 bg-ink/20"}`} />
        ))}
      </div>

      <ul className="mt-3 hidden grid-cols-5 gap-2 sm:grid">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => go(i)}
              className={`block aspect-[4/3] w-full overflow-hidden rounded-xl border-2 bg-mist transition-colors ${i === index ? "border-ink" : "border-transparent hover:border-ink/30"}`}
              aria-label={`Afficher la photo ${i + 1}`}
              aria-current={i === index}
            >
              <img src={photoSrc(p.file, 480)} alt="" loading="lazy" className={`h-full w-full ${p.transparent ? "object-contain p-1" : "object-cover"}`} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
