import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./OverviewSection.module.css";

const HOLD_DISTANCE = 400;
const EXIT_DISTANCE = 200;
const GAP = 100;
const REVEAL_DISTANCE = 200;
const TAIL_HOLD = 600;

// Pre-compute total sequence length for CSS (must stay in sync with timeline below)
const SEQUENCE_LENGTH =
  HOLD_DISTANCE + EXIT_DISTANCE +                       // f1
  GAP + REVEAL_DISTANCE + HOLD_DISTANCE + EXIT_DISTANCE + // f2
  GAP + REVEAL_DISTANCE + HOLD_DISTANCE + EXIT_DISTANCE + // f3
  GAP + REVEAL_DISTANCE + HOLD_DISTANCE + EXIT_DISTANCE + // f4
  GAP + REVEAL_DISTANCE +                                // f5
  TAIL_HOLD;

function OverviewSection() {
  const [introDone, setIntroDone] = useState(false);
  const trackRef = useRef(null);
  const [trackStart, setTrackStart] = useState(0);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Play intro only when starting at or near top with no hash
  useEffect(() => {
    const hasHash = window.location.hash.length > 1;
    const isAtTop = window.scrollY < 50;

    if (!isAtTop || hasHash || prefersReducedMotion) {
      setIntroDone(true);
      return;
    }

    window.scrollTo(0, 0);

    function preventScroll(e) {
      e.preventDefault();
    }
    function preventScrollKeys(e) {
      const scrollKeys = [32, 33, 34, 35, 36, 38, 40];
      if (scrollKeys.includes(e.keyCode)) e.preventDefault();
    }

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys, { passive: false });

    const timer = setTimeout(() => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
      setIntroDone(true);
    }, 3500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    function measure() {
      const el = trackRef.current;
      if (!el) return;
      setTrackStart(el.getBoundingClientRect().top + window.scrollY);
    }
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Frame 1: "GH INTERVIEWS 2026" — holds then fades out
  const f1HoldEnd = HOLD_DISTANCE;
  const f1ExitEnd = f1HoldEnd + EXIT_DISTANCE;

  // Frame 2: "8 MERCHANTS." — fades in, holds, fades out
  const f2RevealStart = f1ExitEnd + GAP;
  const f2RevealEnd = f2RevealStart + REVEAL_DISTANCE;
  const f2HoldEnd = f2RevealEnd + HOLD_DISTANCE;
  const f2ExitEnd = f2HoldEnd + EXIT_DISTANCE;

  // Frame 3: "8 CONVERSATIONS." — fades in, holds, fades out
  const f3RevealStart = f2ExitEnd + GAP;
  const f3RevealEnd = f3RevealStart + REVEAL_DISTANCE;
  const f3HoldEnd = f3RevealEnd + HOLD_DISTANCE;
  const f3ExitEnd = f3HoldEnd + EXIT_DISTANCE;

  // Frame 4: "1 MARKET." — fades in, holds, fades out
  const f4RevealStart = f3ExitEnd + GAP;
  const f4RevealEnd = f4RevealStart + REVEAL_DISTANCE;
  const f4HoldEnd = f4RevealEnd + HOLD_DISTANCE;
  const f4ExitEnd = f4HoldEnd + EXIT_DISTANCE;

  // Frame 5: "YOU'LL WANT TO CEDIS." — fades in and stays
  const f5RevealStart = f4ExitEnd + GAP;
  const f5RevealEnd = f5RevealStart + REVEAL_DISTANCE;

  // Frame 1 transforms
  const f1ScrollOpacity = useTransform(
    scrollY,
    [trackStart, trackStart + f1HoldEnd, trackStart + f1ExitEnd],
    [1, 1, 0],
  );
  const f1Y = useTransform(
    scrollY,
    [trackStart, trackStart + f1HoldEnd, trackStart + f1ExitEnd],
    [0, 0, -24],
  );

  // Frame 2 transforms
  const f2Opacity = useTransform(
    scrollY,
    [trackStart + f2RevealStart, trackStart + f2RevealEnd, trackStart + f2HoldEnd, trackStart + f2ExitEnd],
    [0, 1, 1, 0],
  );
  const f2Y = useTransform(
    scrollY,
    [trackStart + f2RevealStart, trackStart + f2RevealEnd, trackStart + f2HoldEnd, trackStart + f2ExitEnd],
    [24, 0, 0, -24],
  );

  // Frame 3 transforms
  const f3Opacity = useTransform(
    scrollY,
    [trackStart + f3RevealStart, trackStart + f3RevealEnd, trackStart + f3HoldEnd, trackStart + f3ExitEnd],
    [0, 1, 1, 0],
  );
  const f3Y = useTransform(
    scrollY,
    [trackStart + f3RevealStart, trackStart + f3RevealEnd, trackStart + f3HoldEnd, trackStart + f3ExitEnd],
    [24, 0, 0, -24],
  );

  // Frame 4 transforms
  const f4Opacity = useTransform(
    scrollY,
    [trackStart + f4RevealStart, trackStart + f4RevealEnd, trackStart + f4HoldEnd, trackStart + f4ExitEnd],
    [0, 1, 1, 0],
  );
  const f4Y = useTransform(
    scrollY,
    [trackStart + f4RevealStart, trackStart + f4RevealEnd, trackStart + f4HoldEnd, trackStart + f4ExitEnd],
    [24, 0, 0, -24],
  );

  // Frame 5 transforms
  const f5Opacity = useTransform(
    scrollY,
    [trackStart + f5RevealStart, trackStart + f5RevealEnd],
    [0, 1],
  );
  const f5Y = useTransform(
    scrollY,
    [trackStart + f5RevealStart, trackStart + f5RevealEnd],
    [24, 0],
  );

  return (
    <section className={styles.section} aria-labelledby="overview-heading">
      <div
        ref={trackRef}
        className={styles.track}
        style={{ "--overview-sequence-length": `${SEQUENCE_LENGTH}px` }}
      >
        <div className={styles.viewport}>
          <motion.h1
            className={styles.title}
            id="overview-heading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
            style={{ opacity: introDone ? f1ScrollOpacity : undefined, y: introDone ? f1Y : undefined }}
          >
            GH Interviews 2026
          </motion.h1>

          <motion.p
            className={styles.title}
            aria-hidden="true"
            style={{ opacity: f2Opacity, y: f2Y }}
          >
            8 merchants.
          </motion.p>

          <motion.p
            className={styles.title}
            aria-hidden="true"
            style={{ opacity: f3Opacity, y: f3Y }}
          >
            8 conversations.
          </motion.p>

          <motion.p
            className={styles.title}
            aria-hidden="true"
            style={{ opacity: f4Opacity, y: f4Y }}
          >
            1 market.
          </motion.p>

          <motion.p
            className={styles.title}
            aria-hidden="true"
            style={{ opacity: f5Opacity, y: f5Y }}
          >
            You&apos;ll want to cedis.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default OverviewSection;
