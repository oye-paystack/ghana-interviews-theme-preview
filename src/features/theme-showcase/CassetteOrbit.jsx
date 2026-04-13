import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { Carousel, useCarousel } from "motion-plus/react";
import CassetteArtwork, { getTintedCassetteSrc } from "./CassetteArtwork";
import styles from "./CassetteOrbit.module.css";

const scaleTransition = {
  type: "spring",
  stiffness: 420,
  damping: 42,
  mass: 0.9,
};

const opacityTransition = {
  duration: 0.18,
  ease: [0.32, 0, 0.67, 0],
};

const pageTransition = {
  type: "spring",
  stiffness: 420,
  damping: 42,
  mass: 0.9,
};

const OrbitContext = createContext({ activeIndex: 0, isPlaying: false });

function getPositionLabel(distance) {
  if (distance === 0) return "center";
  if (distance === 1) return "right";
  if (distance === -1) return "left";
  return distance > 1 ? "hidden-right" : "hidden-left";
}

function getItemVisuals(distance) {
  if (distance === 0) return { scale: 1, opacity: 1 };
  if (distance === 1) return { scale: 0.95, opacity: 0.34 };
  if (distance === -1) return { scale: 0.95, opacity: 0 };
  return { scale: 0.92, opacity: 0 };
}

function CassetteItem({ merchant, index, staticCassetteSrc }) {
  const { activeIndex, isPlaying } = useContext(OrbitContext);
  const distance = index - activeIndex;
  const position = getPositionLabel(distance);
  const isCenterCassette = distance === 0;
  const { scale, opacity } = getItemVisuals(distance);
  return (
    <div className={styles.cassetteSlide}>
      <motion.article
        className={styles.cassette}
        data-position={position}
        data-playing={isCenterCassette && isPlaying ? "true" : "false"}
        data-testid={`cassette-${merchant.id}`}
        style={opacity === 0 ? { pointerEvents: "none" } : undefined}
        animate={{ scale, opacity }}
        transition={{
          scale: scaleTransition,
          opacity: opacityTransition,
        }}
      >
        <CassetteArtwork
          isInline={isCenterCassette}
          isSpinning={isCenterCassette && isPlaying}
          staticSrc={staticCassetteSrc}
        />
        <div
          className={styles.cassetteLabel}
          style={merchant.labelPosition ? {
            top: `${merchant.labelPosition.top + 4}px`,
            transform: `translateX(-50%) rotate(${merchant.labelPosition.rotate}deg)`,
          } : undefined}
        >
          {merchant.recordingLabel}
        </div>
      </motion.article>
    </div>
  );
}

function CarouselSync({ activeIndex, onPageChange }) {
  const { gotoPage, currentPage, totalPages } = useCarousel();
  const gotoPageRef = useRef(gotoPage);
  const intendedPage = useRef(activeIndex);
  const isNavigating = useRef(false);
  gotoPageRef.current = gotoPage;

  useEffect(() => {
    if (totalPages > 0) {
      intendedPage.current = activeIndex;
      isNavigating.current = true;
      gotoPageRef.current(activeIndex);
    }
  }, [activeIndex, totalPages]);

  useEffect(() => {
    if (!onPageChange || !Number.isInteger(currentPage) || currentPage < 0 || currentPage >= totalPages) return;
    if (currentPage === intendedPage.current) {
      isNavigating.current = false;
      return;
    }
    if (isNavigating.current) return;
    intendedPage.current = currentPage;
    onPageChange(currentPage);
  }, [currentPage, onPageChange, totalPages]);

  return null;
}

function CassetteOrbit({
  merchants,
  activeIndex,
  spacing,
  sideOffsetY,
  isPlaying,
  panelColor,
  onActiveIndexChange,
}) {
  const staticCassetteSrc = useMemo(() => getTintedCassetteSrc(panelColor), [panelColor]);
  const contextValue = useMemo(
    () => ({ activeIndex, isPlaying }),
    [activeIndex, isPlaying],
  );

  const items = useMemo(
    () =>
      merchants.map((merchant, index) => (
        <CassetteItem
          key={merchant.id}
          merchant={merchant}
          index={index}
          staticCassetteSrc={staticCassetteSrc}
        />
      )),
    [merchants, staticCassetteSrc],
  );

  return (
    <OrbitContext.Provider value={contextValue}>
      <div className={styles.orbit} aria-hidden="true">
        <div className={styles.carouselWrapper} style={{ width: spacing }}>
          <Carousel
            items={items}
            itemSize="fill"
            loop={false}
            snap="page"
            overflow
            pageTransition={pageTransition}
          >
            <CarouselSync
              activeIndex={activeIndex}
              onPageChange={onActiveIndexChange}
            />
          </Carousel>
        </div>
      </div>
    </OrbitContext.Provider>
  );
}

export default CassetteOrbit;
