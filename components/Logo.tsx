export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="MS Rent">
      <span
        className={`grid h-9 w-9 place-items-center rounded-lg font-display text-[15px] font-extrabold tracking-tight ${light ? "bg-white text-ink" : "bg-ink text-white"}`}
        aria-hidden="true"
      >
        MS
      </span>
      <span className={`${compact ? "hidden sm:inline" : ""} font-display text-lg font-bold tracking-[0.14em] ${light ? "text-white" : "text-ink"}`} aria-hidden="true">
        RENT
      </span>
    </span>
  );
}
