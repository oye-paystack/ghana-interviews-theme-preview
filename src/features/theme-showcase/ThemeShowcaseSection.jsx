import { useState } from "react";
import ConfigPopover from "./ConfigPopover";
import MerchantCopy from "./MerchantCopy";
import MerchantNav from "./MerchantNav";
import PlayerStage from "./PlayerStage";
import styles from "./ThemeShowcaseSection.module.css";

const DEFAULT_ORBIT_SPACING = 392;
const DEFAULT_TEXT_MORPH_DURATION = 400;
const DEFAULT_TEXT_MORPH_EASE = [0.19, 1, 0.22, 1];

function clampIndex(value, length) {
  if (length <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), length - 1);
}

function ThemeShowcaseSection({
  theme,
  merchants,
  initialActiveIndex = 0,
  showDebugControls = true,
}) {
  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(initialActiveIndex, merchants.length),
  );
  const [orbitSpacing, setOrbitSpacing] = useState(DEFAULT_ORBIT_SPACING);
  const [textMorphDuration, setTextMorphDuration] = useState(DEFAULT_TEXT_MORPH_DURATION);
  const [textMorphEase, setTextMorphEase] = useState(DEFAULT_TEXT_MORPH_EASE);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const activeMerchant = merchants[activeIndex];
  const atStart = activeIndex === 0;
  const atEnd = activeIndex === merchants.length - 1;
  const sectionHeadingId = `${theme.id}-heading`;
  const textMorphEaseString = `cubic-bezier(${textMorphEase.join(", ")})`;

  const sectionStyle = {
    "--orbit-spacing": `${orbitSpacing}px`,
  };

  return (
    <section
      className={styles.section}
      style={sectionStyle}
      aria-labelledby={sectionHeadingId}
      data-testid="theme-showcase-section"
    >
      <h1 className={styles.heading} id={sectionHeadingId}>
        {theme.sectionHeading}
      </h1>

      <div className={styles.card}>
        <div className={styles.tag} aria-label={`Theme ${theme.indexLabel} title`}>
          <span className={styles.tagIndex}>{theme.indexLabel}</span>
          <span className={styles.tagText}>{theme.title}</span>
        </div>

        <div className={styles.cardBody}>
          <section className={`${styles.panel} ${styles.copyPanel}`} aria-live="polite">
            <MerchantCopy merchant={activeMerchant} />
          </section>

          <section className={`${styles.panel} ${styles.playerPanel}`} aria-label="Cassette player">
            <PlayerStage
              merchants={merchants}
              activeIndex={activeIndex}
              activeMerchant={activeMerchant}
              spacing={orbitSpacing}
              textMorphDuration={textMorphDuration}
              textMorphEase={textMorphEaseString}
            />
          </section>
        </div>
      </div>

      <MerchantNav
        merchants={merchants}
        activeIndex={activeIndex}
        onPrev={() => setActiveIndex((index) => clampIndex(index - 1, merchants.length))}
        onNext={() => setActiveIndex((index) => clampIndex(index + 1, merchants.length))}
        onSelect={(index) => setActiveIndex(index)}
        atStart={atStart}
        atEnd={atEnd}
      />

      {showDebugControls ? (
        <ConfigPopover
          spacing={orbitSpacing}
          textMorphDuration={textMorphDuration}
          textMorphEase={textMorphEase}
          textMorphEaseString={textMorphEaseString}
          isOpen={isConfigOpen}
          onToggle={() => setIsConfigOpen((open) => !open)}
          onSpacingChange={(value) => setOrbitSpacing(value)}
          onTextMorphDurationChange={(value) => setTextMorphDuration(value)}
          onTextMorphEaseChange={(index, value) =>
            setTextMorphEase((currentEase) =>
              currentEase.map((point, pointIndex) =>
                pointIndex === index ? value : point,
              ),
            )
          }
        />
      ) : null}
    </section>
  );
}

export default ThemeShowcaseSection;
