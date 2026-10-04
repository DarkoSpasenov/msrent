"use client";

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${checked ? "bg-wa" : "bg-ink/20"}`}
    >
      <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}
