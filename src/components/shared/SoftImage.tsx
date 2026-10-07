import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface SoftImageProps
  extends Omit<ImageProps, "placeholder" | "blurDataURL" | "onLoad" | "style"> {
  blurDataURL?: string | null;
}

const REVEAL = `document.addEventListener("load",function(e){var i=e.target,s=function(){i.setAttribute("data-charge","")};if(i.tagName==="IMG"&&i.classList.contains("image-douce"))i.decode?i.decode().then(s,s):s()},true)`;

export function SoftImageReveal() {
  return <script dangerouslySetInnerHTML={{ __html: REVEAL }} />;
}

export function SoftImage({
  blurDataURL,
  className,
  alt,
  ...props
}: SoftImageProps) {
  return (
    <>
      <Image
        {...props}
        alt={alt}
        className={cn("image-douce", className)}
        suppressHydrationWarning
      />
      {blurDataURL && (
        <span
          className="flou"
          style={{ "--flou": `url("${blurDataURL}")` } as React.CSSProperties}
          aria-hidden="true"
        />
      )}
    </>
  );
}
