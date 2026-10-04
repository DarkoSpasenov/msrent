// Client-safe helpers for the optimized photo variants written by lib/images.ts.
export const PHOTO_WIDTHS = [480, 960, 1600] as const;

export function photoSrc(file: string, width: (typeof PHOTO_WIDTHS)[number] = 960) {
  return `/media/${file}-${width}.webp`;
}

export function photoSrcSet(file: string) {
  return PHOTO_WIDTHS.map((w) => `${photoSrc(file, w)} ${w}w`).join(", ");
}
