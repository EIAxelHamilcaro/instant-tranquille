"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { PhotoLightbox } from "@/components/shared/PhotoLightbox";
import type { ViewerPhoto } from "@/components/shared/viewer-photos";
import { Dialog } from "@/components/ui/dialog";

export interface ViewerSlide extends ViewerPhoto {
  thumbnail?: string;
}

export interface ViewerEntry {
  photo: ViewerPhoto;
  frame: HTMLElement;
  trigger: HTMLElement;
}

interface PhotoViewerContext {
  register: (entry: ViewerEntry) => () => void;
  open: (entry: ViewerEntry) => void;
}

interface PhotoViewerProps {
  children: React.ReactNode;
}

interface View {
  slides: ViewerSlide[];
  position: number;
  fades: boolean;
}

type MorphPhase = "ouvre" | "ferme";

const STILL = "(prefers-reduced-motion: reduce)";
const ORIGIN = "data-visionneuse-origine";

const Context = createContext<PhotoViewerContext | null>(null);

export const usePhotoViewer = () => useContext(Context);

const canMorph = () =>
  Boolean(document.startViewTransition) && !window.matchMedia(STILL).matches;

const isCopy = (entry: ViewerEntry) => entry.frame.closest("[inert]") !== null;

const inDocumentOrder = (a: ViewerEntry, b: ViewerEntry) =>
  a.frame.compareDocumentPosition(b.frame) & Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;

function isOnScreen(frame: HTMLElement) {
  const box = frame.getBoundingClientRect();

  return (
    box.width > 0 &&
    box.bottom > 0 &&
    box.right > 0 &&
    box.top < window.innerHeight &&
    box.left < window.innerWidth
  );
}

function loadedSource(frame: HTMLElement) {
  const image = frame.querySelector("img");

  return image?.complete && image.naturalWidth > 0
    ? image.currentSrc
    : undefined;
}

function morph(
  phase: MorphPhase,
  origin: HTMLElement | undefined,
  update: () => void,
) {
  const root = document.documentElement;
  const settle = () => {
    root.removeAttribute("data-visionneuse");
    origin?.removeAttribute(ORIGIN);
  };

  root.dataset.visionneuse = phase;
  if (phase === "ouvre") origin?.setAttribute(ORIGIN, "");

  document
    .startViewTransition(() => {
      flushSync(update);
      origin?.toggleAttribute(ORIGIN, phase === "ferme");
    })
    .finished.then(settle, settle);
}

export function PhotoViewer({ children }: PhotoViewerProps) {
  const entries = useRef(new Set<ViewerEntry>());
  const opener = useRef<ViewerEntry | undefined>(undefined);
  const [view, setView] = useState<View | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const register = useCallback((entry: ViewerEntry) => {
    entries.current.add(entry);

    return () => {
      entries.current.delete(entry);
    };
  }, []);

  const open = useCallback((entry: ViewerEntry) => {
    const ordered = [...entries.current].sort(inDocumentOrder);
    const originals = ordered.filter((item) => !isCopy(item));
    const slides = [
      ...new Map(originals.map((item) => [item.photo.id, item.photo])).values(),
    ].map((photo): ViewerSlide => {
      const frames = [
        ...(photo.id === entry.photo.id ? [entry] : []),
        ...ordered.filter((item) => item.photo.id === photo.id),
      ].map((item) => item.frame);

      return {
        ...photo,
        thumbnail: frames.map(loadedSource).find(Boolean),
      };
    });
    const position = slides.findIndex((slide) => slide.id === entry.photo.id);
    if (position < 0) return;

    const fades = !canMorph();
    const show = () => {
      setView({ slides, position, fades });
      setIsOpen(true);
    };

    opener.current =
      originals.find((item) => item.photo.id === entry.photo.id) ?? entry;

    if (fades) show();
    else morph("ouvre", entry.frame, show);
  }, []);

  useEffect(() => {
    const openCopy = (event: MouseEvent) => {
      const { target } = event;
      if (event.defaultPrevented || !(target instanceof Element)) return;

      const copy = [...entries.current].find((entry) => {
        if (!isCopy(entry) || !target.contains(entry.frame)) return false;

        const box = entry.frame.getBoundingClientRect();

        return (
          event.clientX >= box.left &&
          event.clientX <= box.right &&
          event.clientY >= box.top &&
          event.clientY <= box.bottom
        );
      });

      if (copy) open(copy);
    };

    document.addEventListener("click", openCopy);

    return () => document.removeEventListener("click", openCopy);
  }, [open]);

  const close = () => {
    if (!view || !isOpen) return;

    const current =
      view.slides[
        ((view.position % view.slides.length) + view.slides.length) %
          view.slides.length
      ];

    if (view.fades || !canMorph()) {
      setIsOpen(false);
      return;
    }

    const candidates = [...entries.current].filter(
      (entry) => entry.photo.id === current?.id && isOnScreen(entry.frame),
    );
    const landing =
      candidates.find((entry) => entry === opener.current) ?? candidates[0];

    morph("ferme", landing?.frame, () => {
      setIsOpen(false);
      setView(null);
    });
  };

  const restoreFocus = (event: Event) => {
    event.preventDefault();
    opener.current?.trigger.focus();
  };

  const context = useMemo(() => ({ register, open }), [register, open]);

  return (
    <Context value={context}>
      {children}
      <Dialog
        open={isOpen}
        onOpenChange={(next) => {
          if (!next) close();
        }}
      >
        {view && (
          <PhotoLightbox
            slides={view.slides}
            position={view.position}
            fades={view.fades}
            onMove={(delta) =>
              setView(
                (current) =>
                  current && { ...current, position: current.position + delta },
              )
            }
            onClose={close}
            onCloseAutoFocus={restoreFocus}
          />
        )}
      </Dialog>
    </Context>
  );
}
