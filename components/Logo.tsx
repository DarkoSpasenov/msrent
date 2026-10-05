/** MS Rent wordmark: "MS" in the brand turquoise on a black tile, followed by "Rent". */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="MS Rent">
      <span className="grid h-9 place-items-center rounded-[11px] bg-ink px-2 font-display text-[18px] leading-none font-extrabold tracking-[-0.02em] text-brand" aria-hidden="true">
        MS
      </span>
      <span className={`${compact ? "hidden sm:inline" : ""} font-display text-[24px] leading-none font-extrabold tracking-[-0.03em] text-ink`} aria-hidden="true">
        Rent
      </span>
    </span>
  );
}
