import {
  AirplaneTilt,
  BuildingApartment,
  CellSignalFull,
  CellTower,
  Package,
  PiggyBank,
  Plant,
  ShoppingCart,
} from "@phosphor-icons/react";
import { Squircle } from "@cornerkit/react";
import { Ticker } from "motion-plus/react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MerchantCardsGrid.module.css";

const iconMap = {
  airplaneTilt: AirplaneTilt,
  buildingApartment: BuildingApartment,
  cellSignalFull: CellSignalFull,
  cellTower: CellTower,
  package: Package,
  piggyBank: PiggyBank,
  plant: Plant,
  shoppingCart: ShoppingCart,
};

const CAROUSEL_VELOCITY = -72;
const HOVER_TRANSITION_SECONDS = 0.8;
const DESKTOP_GAP = 24;
const MOBILE_GAP = 16;
const MOBILE_BREAKPOINT = 760;

function MerchantCard({ merchant }) {
  const Icon = iconMap[merchant.cardIconKey] ?? Plant;

  return (
    <motion.div
      className={styles.cardShell}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
      <Squircle
        as="article"
        className={styles.card}
        radius={18}
        smoothing={0.9}
        style={{
          "--merchant-card-bg": merchant.cardBaseColor,
          "--merchant-card-texture-opacity": merchant.cardTextureOpacity ?? 1,
          "--merchant-card-texture-blend": merchant.cardTextureBlendMode ?? "plus-lighter",
          "--merchant-card-texture-width": merchant.cardTextureWidth ?? "100%",
          "--merchant-card-texture-height": merchant.cardTextureHeight ?? "100%",
          "--merchant-card-texture-left": merchant.cardTextureLeft ?? "0%",
          "--merchant-card-texture-top": merchant.cardTextureTop ?? "0%",
        }}
      >
        <div className={styles.surface} aria-hidden="true" />
        {merchant.cardTextureSrc ? (
          <img
            alt=""
            aria-hidden="true"
            className={styles.texture}
            decoding="async"
            draggable={false}
            loading="eager"
            src={merchant.cardTextureSrc}
          />
        ) : null}

        <div className={styles.content}>
          <span className={styles.iconFrame} aria-hidden="true">
            <Icon className={styles.icon} weight="regular" />
          </span>
          <p className={styles.title}>{merchant.cardLabel ?? merchant.name}</p>
          <p className={styles.description}>{merchant.cardCategory}</p>
        </div>
      </Squircle>
    </motion.div>
  );
}

function MerchantCardsGrid({ merchants = [] }) {
  const prefersReducedMotion = useReducedMotion();
  const offset = useMotionValue(0);
  const speedFactor = useMotionValue(1);
  const hoverAnimationRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isSettlingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [gap, setGap] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT
      ? MOBILE_GAP
      : DESKTOP_GAP,
  );

  const orderedMerchants = useMemo(
    () => [...merchants].sort(
      (left, right) =>
        (left.cardGridOrder ?? Number.MAX_SAFE_INTEGER)
        - (right.cardGridOrder ?? Number.MAX_SAFE_INTEGER),
    ),
    [merchants],
  );
  const items = useMemo(
    () => orderedMerchants.map((merchant) => (
      <MerchantCard key={merchant.id} merchant={merchant} />
    )),
    [orderedMerchants],
  );

  const animateSpeedFactor = (nextFactor) => {
    hoverAnimationRef.current?.stop();
    hoverAnimationRef.current = animate(speedFactor, nextFactor, {
      duration: HOVER_TRANSITION_SECONDS,
      ease: "easeOut",
      onComplete: () => {
        hoverAnimationRef.current = null;
      },
    });
  };

  useEffect(() => {
    function handleResize() {
      const nextGap = window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_GAP : DESKTOP_GAP;

      setGap((currentGap) => (currentGap === nextGap ? currentGap : nextGap));
    }

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      hoverAnimationRef.current?.stop();
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isDraggingRef.current || isSettlingRef.current) {
      return;
    }

    const frameOffset = (delta / 1000) * (CAROUSEL_VELOCITY * speedFactor.get());

    offset.set(offset.get() - frameOffset);
  });

  useMotionValueEvent(offset, "animationStart", () => {
    if (!isDraggingRef.current) {
      return;
    }

    isSettlingRef.current = true;
  });

  const finishInteraction = () => {
    isDraggingRef.current = false;
    isSettlingRef.current = false;
    setIsDragging(false);

    if (!prefersReducedMotion) {
      animateSpeedFactor(isHoveredRef.current ? 0 : 1);
    }
  };

  useMotionValueEvent(offset, "animationComplete", finishInteraction);
  useMotionValueEvent(offset, "animationCancel", finishInteraction);

  if (!orderedMerchants.length) {
    return null;
  }

  return (
    <div className={styles.wrap}>
      <div
        aria-label="Merchant cards overview"
        className={`${styles.viewport} ${isDragging ? styles.viewportDragging : ""}`}
        onDragStartCapture={(event) => event.preventDefault()}
        onPointerEnter={() => {
          isHoveredRef.current = true;

          if (!isDraggingRef.current && !isSettlingRef.current && !prefersReducedMotion) {
            animateSpeedFactor(0);
          }
        }}
        onPointerLeave={() => {
          isHoveredRef.current = false;

          if (!isDraggingRef.current && !isSettlingRef.current && !prefersReducedMotion) {
            animateSpeedFactor(1);
          }
        }}
        onPointerUpCapture={() => {
          if (!isDraggingRef.current) {
            return;
          }

          window.requestAnimationFrame(() => {
            if (!isSettlingRef.current) {
              finishInteraction();
            }
          });
        }}
        onPointerCancelCapture={() => {
          if (!isDraggingRef.current) {
            return;
          }

          finishInteraction();
        }}
      >
        <Ticker
          _dragX={offset}
          className={styles.ticker}
          drag={prefersReducedMotion ? false : "x"}
          gap={gap}
          items={items}
          offset={offset}
          overflow
          safeMargin={48}
          snap={false}
          onDragStart={() => {
            isDraggingRef.current = true;
            isSettlingRef.current = false;
            setIsDragging(true);
            hoverAnimationRef.current?.stop();
            speedFactor.set(0);
          }}
        />
      </div>
    </div>
  );
}

export default MerchantCardsGrid;
