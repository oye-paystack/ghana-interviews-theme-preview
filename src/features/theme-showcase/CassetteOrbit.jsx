import { useMemo } from "react";
import { motion } from "motion/react";
import CassetteArtwork, { getTintedCassetteSrc } from "./CassetteArtwork";
import styles from "./CassetteOrbit.module.css";

const positionConfigs = {
  left: {
    x: (spacing) => spacing * -1,
    y: () => 0,
    rotate: 0,
    scale: 0.95,
    opacity: 0,
  },
  center: {
    x: () => 0,
    y: () => 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
  },
  right: {
    x: (spacing) => spacing,
    y: () => 0,
    rotate: 0,
    scale: 0.95,
    opacity: 0.34,
  },
  "hidden-left": {
    x: (spacing) => (spacing + 84) * -1,
    y: () => 0,
    rotate: 0,
    scale: 0.92,
    opacity: 0,
  },
  "hidden-right": {
    x: (spacing) => spacing + 84,
    y: () => 0,
    rotate: 0,
    scale: 0.92,
    opacity: 0,
  },
};

const movementTransition = {
  type: "spring",
  bounce: 0.08,
  visualDuration: 0.62,
};

const opacityTransition = {
  duration: 0.22,
  ease: "linear",
};

function getCassettePosition(index, activeIndex) {
  const distance = index - activeIndex;

  if (distance === 0) {
    return "center";
  }

  if (distance === 1) {
    return "right";
  }

  if (distance === -1) {
    return "left";
  }

  return distance > 1 ? "hidden-right" : "hidden-left";
}

function CassetteOrbit({
  merchants,
  activeIndex,
  spacing,
  sideOffsetY,
  isPlaying,
  panelColor,
}) {
  const staticCassetteSrc = useMemo(() => getTintedCassetteSrc(panelColor), [panelColor]);

  return (
    <div
      className={styles.orbit}
      style={{
        "--orbit-spacing": `${spacing}px`,
        "--side-cassette-offset-y": `${sideOffsetY}px`,
      }}
      data-side-offset-y={sideOffsetY}
      aria-hidden="true"
    >
      {merchants.map((merchant, index) => {
        const position = getCassettePosition(index, activeIndex);
        const isCenterCassette = position === "center";
        const config = positionConfigs[position];

        return (
          <motion.article
            className={styles.cassette}
            data-position={position}
            data-playing={isCenterCassette && isPlaying ? "true" : "false"}
            data-testid={`cassette-${merchant.id}`}
            key={merchant.id}
            style={{
              zIndex: index + 1,
              willChange:
                position === "hidden-left" || position === "hidden-right"
                  ? "auto"
                  : "transform, opacity",
            }}
            animate={{
              x: config.x(spacing),
              y: config.y(sideOffsetY),
              rotate: config.rotate,
              scale: config.scale,
              opacity: config.opacity,
            }}
            transition={{
              x: movementTransition,
              y: movementTransition,
              rotate: movementTransition,
              scale: movementTransition,
              opacity: opacityTransition,
            }}
          >
            <CassetteArtwork
              isInline={isCenterCassette}
              isSpinning={isCenterCassette && isPlaying}
              staticSrc={staticCassetteSrc}
            />
            <div className={styles.cassetteLabel}>{merchant.recordingLabel}</div>
          </motion.article>
        );
      })}
    </div>
  );
}

export default CassetteOrbit;
