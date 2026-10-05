"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

/** Horizontal, swipeable car slider with arrow buttons. */
export function CarSlider({ title, titleId, children }: { title: string; titleId: string; children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  const arrow = "grid h-12 w-12 place-items-center rounded-2xl border-2 border-line bg-white transition-colors hover:border-ink disabled:cursor-default disabled:opacity-35 disabled:hover:border-line";

  return (
    <>
      <div className="container-x flex items-end justify-between gap-4">
        <h2 id={titleId} className="text-4xl font-extrabold sm:text-5xl">
          {title}
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button type="button" className={arrow} onClick={() => go(-1)} disabled={edges.start} aria-label="Voiture précédente">
            <ChevronLeftIcon />
          </button>
          <button type="button" className={arrow} onClick={() => go(1)} disabled={edges.end} aria-label="Voiture suivante">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <div
        ref={track}
        onScroll={update}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-(--gutter) pb-2 [--gutter:1rem] [scroll-padding-inline:var(--gutter)] sm:[--gutter:1.5rem] lg:[--gutter:max(2.5rem,calc((100%-80rem)/2+2.5rem))]"
      >
        {Children.map(children, (child) => (
          <div className="w-[84%] shrink-0 snap-start sm:w-[calc(50%-12px)] xl:w-[calc((100%-48px)/3)]">{child}</div>
        ))}
      </div>
    </>
  );
}
