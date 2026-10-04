// Each car gets a pastel background, cycling in display order so neighbours differ.
const TONES = ["bg-tone-sky", "bg-tone-sand", "bg-tone-mint", "bg-tone-lilac", "bg-tone-lemon"] as const;

export function toneAt(index: number): string {
  return TONES[((index % TONES.length) + TONES.length) % TONES.length];
}
