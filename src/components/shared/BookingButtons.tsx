import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BookingButtonsProps {
  bookingLinks?: {
    airbnb?: string | null;
    booking?: string | null;
    email?: string | null;
  } | null;
  showContact?: boolean;
  size?: "default" | "lg";
  className?: string;
}

export function AirbnbLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.003 0C5.376 0 0 5.372 0 12c0 6.627 5.376 12 12.003 12C18.63 24 24 18.627 24 12c0-6.628-5.37-12-11.997-12zm-.124 4.5c1.02 0 1.846.826 1.846 1.845 0 1.02-.826 1.847-1.846 1.847S10.033 7.365 10.033 6.345c0-1.019.826-1.845 1.846-1.845zM7.382 15.27c-.16-.427-.247-.888-.247-1.363 0-1.985 1.46-3.672 3.368-4.02a4.27 4.27 0 011.495 0c1.907.348 3.368 2.035 3.368 4.02 0 .475-.087.936-.247 1.363l-1.41 3.765c-.217.578-.77.955-1.384.955h-1.75c-.613 0-1.166-.377-1.383-.955L7.382 15.27zm3.25 3.565h.74l1.28-3.415c.103-.277.16-.573.16-.878 0-1.116-.793-2.055-1.862-2.268a2.47 2.47 0 00-.498-.05 2.47 2.47 0 00-.498.05c-1.069.213-1.863 1.152-1.863 2.268 0 .305.057.6.16.878l1.28 3.415z" />
    </svg>
  );
}

export function BookingLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.246 0A2.246 2.246 0 000 2.246v19.512A2.246 2.246 0 002.246 24h19.512A2.246 2.246 0 0024 21.754V2.246A2.246 2.246 0 0021.758 0zm6.377 4.808h2.03c1.46 0 2.444.265 2.953.794.51.529.765 1.291.765 2.284 0 .74-.176 1.373-.529 1.896-.353.523-.877.854-1.571.996.46.12.812.385 1.053.796.244.41.557 1.14.942 2.19l1.088 2.955H13.03l-.877-2.547c-.37-1.058-.676-1.718-.916-1.98-.24-.264-.606-.396-1.097-.396H9.96v4.923H8.623zm1.337 1.186v3.548h.968c.838 0 1.412-.16 1.723-.48.311-.32.466-.793.466-1.42 0-.6-.163-1.056-.49-1.366-.327-.31-.876-.466-1.645-.466h-1.022zm5.79-.006h1.338v9.44h-1.338z" />
    </svg>
  );
}

export function BookingButtons({
  bookingLinks,
  showContact = false,
  size = "default",
  className,
}: BookingButtonsProps) {
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");

  const pad = size === "lg" ? "px-7 py-4 text-base" : "px-5 py-3 text-sm";

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {bookingLinks?.airbnb && (
        <a
          href={bookingLinks.airbnb}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${tHome("ctaAirbnb")}, ${tCommon("opensNewTab")}`}
          className={cn(
            "inline-flex items-center gap-2.5 rounded-lg bg-[#FF385C] font-sans font-semibold text-white shadow-sm transition-all hover:bg-[#E31C5F] hover:shadow-md active:scale-[0.98]",
            pad,
          )}
        >
          <AirbnbLogo className="h-5 w-5 shrink-0" />
          {tHome("ctaAirbnb")}
        </a>
      )}
      {bookingLinks?.booking && (
        <a
          href={bookingLinks.booking}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${tHome("ctaBooking")}, ${tCommon("opensNewTab")}`}
          className={cn(
            "inline-flex items-center gap-2.5 rounded-lg bg-[#006CE4] font-sans font-semibold text-white shadow-sm transition-all hover:bg-[#0057b8] hover:shadow-md active:scale-[0.98]",
            pad,
          )}
        >
          <BookingLogo className="h-5 w-5 shrink-0" />
          {tHome("ctaBooking")}
        </a>
      )}
      {showContact && (
        <Link
          href="/contact"
          className={cn(
            "inline-flex items-center gap-2.5 rounded-lg border border-primary-500 font-sans font-semibold text-primary-600 transition-colors hover:bg-primary-50 active:scale-[0.98]",
            pad,
          )}
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
          {tHome("ctaContact")}
        </Link>
      )}
    </div>
  );
}
