import CassetteArtwork from "./CassetteArtwork";
import styles from "./CassetteOrbit.module.css";

const positionClassNames = {
  left: styles.cassetteLeft,
  center: styles.cassetteCenter,
  right: styles.cassetteRight,
  "hidden-left": styles.cassetteHiddenLeft,
  "hidden-right": styles.cassetteHiddenRight,
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
}) {
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

        return (
          <article
            className={`${styles.cassette} ${positionClassNames[position]}`}
            data-position={position}
            data-playing={isCenterCassette && isPlaying ? "true" : "false"}
            data-testid={`cassette-${merchant.id}`}
            key={merchant.id}
            style={{ "--stack-order": index + 1 }}
          >
            <CassetteArtwork
              isInline={isCenterCassette}
              isSpinning={isCenterCassette && isPlaying}
            />
            <div className={styles.cassetteLabel}>{merchant.recordingLabel}</div>
          </article>
        );
      })}
    </div>
  );
}

export default CassetteOrbit;
