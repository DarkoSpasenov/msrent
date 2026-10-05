import { CarMark } from "@/components/CarMark";

/** MS Rent logo: the car from the original logo, redrawn as a sharp vector, with the name. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3" aria-label="MS Rent">
      <CarMark className="h-9 w-auto text-ink" />
      <span className={`${compact ? "hidden sm:block" : "block"} font-display text-[22px] leading-none font-extrabold tracking-[0.04em] whitespace-nowrap text-ink`} aria-hidden="true">
        MS <span className="text-brand-ink">RENT</span>
      </span>
    </span>
  );
}
