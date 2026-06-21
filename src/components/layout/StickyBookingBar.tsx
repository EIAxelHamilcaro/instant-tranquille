"use client";

import { useEffect, useState } from "react";
import { BookingButtons } from "@/components/shared/BookingButtons";

interface StickyBookingBarProps {
  bookingLinks?: {
    airbnb?: string | null;
    booking?: string | null;
  } | null;
}

export function StickyBookingBar({ bookingLinks }: StickyBookingBarProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:85vh;pointer-events:none;";
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  if (!bookingLinks?.airbnb && !bookingLinks?.booking) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)] backdrop-blur transition-transform duration-300 ease-out lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <BookingButtons
        bookingLinks={bookingLinks}
        className="flex-nowrap justify-center [&>a]:flex-1 [&>a]:justify-center [&>a]:px-3"
      />
    </div>
  );
}
