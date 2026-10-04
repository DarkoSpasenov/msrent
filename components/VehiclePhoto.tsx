import { CarIcon } from "@/components/icons";
import { photoSrc, photoSrcSet } from "@/lib/photo";

type PhotoLike = { file: string; width: number; height: number; transparent: boolean };

/**
 * Optimized responsive photo. Cut-out PNG style photos (transparent background)
 * are shown whole; regular photos fill the frame.
 */
export function VehiclePhoto({
  photo,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  photo: PhotoLike | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!photo) {
    return (
      <div className={`grid place-items-center bg-mist text-muted/60 ${className}`} role="img" aria-label={`${alt} (photo à venir)`}>
        <CarIcon width={56} height={56} strokeWidth={1.2} />
      </div>
    );
  }
  return (
    <img
      src={photoSrc(photo.file, 960)}
      srcSet={photoSrcSet(photo.file)}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={`${photo.transparent ? "object-contain p-[8%]" : "object-cover"} ${className}`}
    />
  );
}
