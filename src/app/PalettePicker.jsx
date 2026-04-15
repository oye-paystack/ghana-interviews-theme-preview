import { useCallback, useEffect, useState } from "react";
import styles from "./PalettePicker.module.css";

const PALETTES = [
  { id: null, name: "Current (Brown)" },
  { id: "slate", name: "Editorial Slate" },
  { id: "navy", name: "Ink Navy" },
  { id: "plum", name: "Ink Plum" },
];

const STORAGE_KEY = "palette-picker:index";

function PalettePicker() {
  const [index, setIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored == null ? 0 : Number.parseInt(stored, 10);
    if (Number.isNaN(parsed) || parsed < 0 || parsed >= PALETTES.length) {
      return 0;
    }
    return parsed;
  });

  const current = PALETTES[index];

  useEffect(() => {
    const root = document.documentElement;
    if (current.id == null) {
      root.removeAttribute("data-palette");
    } else {
      root.setAttribute("data-palette", current.id);
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, String(index));
    } catch {
      // Ignore storage errors (private mode, etc).
    }
  }, [index, current.id]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + PALETTES.length) % PALETTES.length);
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % PALETTES.length);
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) {
          return;
        }
      }
      if (event.key === "ArrowLeft" && event.altKey) {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight" && event.altKey) {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  return (
    <div className={styles.pill} role="group" aria-label="Palette picker">
      <button
        type="button"
        className={styles.button}
        onClick={goPrev}
        aria-label="Previous palette"
      >
        <span className={styles.buttonIcon} aria-hidden="true">
          ‹
        </span>
      </button>
      <span className={styles.counter} aria-live="polite">
        {index + 1}/{PALETTES.length}
      </span>
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.label}>{current.name}</span>
      <span className={styles.divider} aria-hidden="true" />
      <button
        type="button"
        className={styles.button}
        onClick={goNext}
        aria-label="Next palette"
      >
        <span className={styles.buttonIcon} aria-hidden="true">
          ›
        </span>
      </button>
    </div>
  );
}

export default PalettePicker;
