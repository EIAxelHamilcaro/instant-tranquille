"use client";

import { useEffect, useId, useRef, useState } from "react";

interface HelpProps {
  text: string;
  about?: string;
}

export default function Help({ text, about }: HelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [isOpen]);

  return (
    <span className="lit-bulle" ref={root}>
      <button
        type="button"
        className="lit-bulle-bouton"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">?</span>
        <span className="lit-hors-ecran">
          {about ? `Aide : ${about}` : "Aide"}
        </span>
      </button>
      <span className="lit-bulle-texte" id={id} role="status" hidden={!isOpen}>
        {isOpen ? text : null}
      </span>
    </span>
  );
}
