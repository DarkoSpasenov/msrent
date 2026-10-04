const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** MS Rent logo: the turquoise car of the original logo on its black badge, plus the wordmark. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-10 w-[54px] place-items-center rounded-xl bg-ink" aria-hidden="true">
        <img src={`${BASE}/brand/mark-cyan.png`} alt="" width={40} height={24} className="h-auto w-10" />
      </span>
      <span className={`${compact ? "hidden sm:flex" : "flex"} flex-col leading-none`}>
        <span className="font-display text-[19px] font-extrabold tracking-[0.16em] text-ink">MS RENT</span>
        <span className="mt-1 text-[9.5px] font-bold tracking-[0.2em] text-muted uppercase">Location de véhicules</span>
      </span>
      <span className="sr-only">MS Rent</span>
    </span>
  );
}
