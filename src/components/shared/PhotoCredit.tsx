import type { Media } from "@/payload-types";

interface PhotoCreditProps {
  media: Pick<Media, "alt" | "credit" | "creditUrl">;
}

export function PhotoCredit({ media }: PhotoCreditProps) {
  if (!media.credit) return null;

  return (
    <small className="credit">
      {media.creditUrl ? (
        <a href={media.creditUrl} rel="noopener license" target="_blank">
          {media.credit}
          <span className="sr-only">, {media.alt}</span>
        </a>
      ) : (
        media.credit
      )}
    </small>
  );
}
