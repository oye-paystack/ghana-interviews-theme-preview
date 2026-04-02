import { useEffect, useMemo, useRef, useState } from "react";
import ConfigPopover from "./ConfigPopover";
import MerchantNav from "./MerchantNav";
import PlaybackPanels from "./PlaybackPanels";
import styles from "./ThemeShowcaseSection.module.css";

const DEFAULT_ORBIT_SPACING = 360;
const DEFAULT_SIDE_CASSETTE_OFFSET_Y = -12;
const DEFAULT_TEXT_MORPH_DURATION = 400;
const DEFAULT_TEXT_MORPH_EASE = [0.19, 1, 0.22, 1];
const DEFAULT_PLAYBACK_PULSE_DURATION = 3200;
const DEFAULT_THEME_SPACING = 64;

function clampIndex(value, length) {
  if (length <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), length - 1);
}

function ThemeShowcaseSection({
  theme,
  themes,
  merchants,
  initialActiveIndex = 0,
  showDebugControls = true,
}) {
  const themeList = useMemo(() => {
    if (themes?.length) {
      return themes;
    }

    return theme ? [theme] : [];
  }, [theme, themes]);
  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(initialActiveIndex, merchants.length),
  );
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [orbitSpacing, setOrbitSpacing] = useState(DEFAULT_ORBIT_SPACING);
  const [sideCassetteOffsetY, setSideCassetteOffsetY] = useState(
    DEFAULT_SIDE_CASSETTE_OFFSET_Y,
  );
  const [textMorphDuration, setTextMorphDuration] = useState(DEFAULT_TEXT_MORPH_DURATION);
  const [textMorphEase, setTextMorphEase] = useState(DEFAULT_TEXT_MORPH_EASE);
  const [playbackPulseDuration, setPlaybackPulseDuration] = useState(
    DEFAULT_PLAYBACK_PULSE_DURATION,
  );
  const [themeSpacing, setThemeSpacing] = useState(DEFAULT_THEME_SPACING);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [themeScrollDistance, setThemeScrollDistance] = useState(0);
  const sectionRef = useRef(null);
  const slideViewportRef = useRef(null);
  const trackRef = useRef(null);
  const frameRef = useRef(0);
  const themeStepRef = useRef(0);
  const maxThemeDistanceRef = useRef(0);

  const activeMerchant = merchants[activeIndex];
  const sectionHeadingId = `${themeList[0]?.id ?? "theme-showcase"}-heading`;
  const textMorphEaseString = `cubic-bezier(${textMorphEase.join(", ")})`;

  const sectionStyle = {
    "--orbit-spacing": `${orbitSpacing}px`,
    "--theme-scroll-distance": `${themeScrollDistance}px`,
    "--theme-slide-gap": `${themeSpacing}px`,
  };

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = slideViewportRef.current;
    const track = trackRef.current;

    if (!section || !viewport || !track) {
      return undefined;
    }

    function updateMetrics() {
      if (themeList.length <= 1) {
        themeStepRef.current = 0;
        maxThemeDistanceRef.current = 0;
        setThemeScrollDistance(0);
        track.style.transform = "translate3d(0px, 0px, 0px)";
        setActiveThemeIndex(0);
        return;
      }

      const viewportWidth = viewport.clientWidth;
      const themeStep = viewportWidth + themeSpacing;
      const totalDistance = Math.max(0, track.scrollWidth - viewportWidth);

      themeStepRef.current = themeStep;
      maxThemeDistanceRef.current = totalDistance;
      setThemeScrollDistance(totalDistance);
    }

    function updateTrackPosition() {
      const maxDistance = maxThemeDistanceRef.current;

      if (maxDistance <= 0) {
        track.style.transform = "translate3d(0px, 0px, 0px)";
        return;
      }

      const sectionTop = section.getBoundingClientRect().top;
      const progress = Math.min(Math.max(-sectionTop, 0), maxDistance);

      track.style.transform = `translate3d(-${progress}px, 0px, 0px)`;

      const nextThemeIndex = clampIndex(
        Math.round(progress / themeStepRef.current),
        themeList.length,
      );

      setActiveThemeIndex((currentIndex) =>
        currentIndex === nextThemeIndex ? currentIndex : nextThemeIndex,
      );
    }

    function requestPositionUpdate() {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        updateTrackPosition();
        frameRef.current = 0;
      });
    }

    function handleResize() {
      updateMetrics();
      requestPositionUpdate();
    }

    updateMetrics();
    updateTrackPosition();
    window.addEventListener("scroll", requestPositionUpdate, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", requestPositionUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, [themeList, themeSpacing]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={sectionStyle}
      aria-labelledby={sectionHeadingId}
      data-testid="theme-showcase-section"
      data-show-grid={showGridOverlay ? "true" : "false"}
    >
      <div className={styles.stickyStage}>
        <div className={styles.gridOverlay} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <span className={styles.gridOverlayColumn} key={`grid-column-${index}`} />
          ))}
        </div>

        <h1 className={styles.heading} id={sectionHeadingId}>
          {themeList[0]?.sectionHeading}
        </h1>

        <div
          className={styles.themeViewport}
          ref={slideViewportRef}
          data-active-theme-index={activeThemeIndex}
        >
          <div className={styles.themeTrack} ref={trackRef}>
            {themeList.map((themeItem, themeIndex) => {
              const isActiveTheme = themeIndex === activeThemeIndex;

              return (
                <div
                  className={styles.themeSlide}
                  key={themeItem.id}
                  aria-hidden={isActiveTheme ? undefined : "true"}
                >
                  <div
                    className={styles.card}
                    style={{ "--theme-player-panel": themeItem.playerPanelColor }}
                  >
                    <div className={styles.tag} aria-label={`Theme ${themeItem.indexLabel} title`}>
                      <span className={styles.tagIndex}>{themeItem.indexLabel}</span>
                      <span className={styles.tagText}>{themeItem.title}</span>
                    </div>

                    <div className={styles.cardBody}>
                      <PlaybackPanels
                        merchants={merchants}
                        activeIndex={activeIndex}
                        activeMerchant={activeMerchant}
                        orbitSpacing={orbitSpacing}
                        sideCassetteOffsetY={sideCassetteOffsetY}
                        textMorphDuration={textMorphDuration}
                        textMorphEaseString={textMorphEaseString}
                        playbackPulseDuration={playbackPulseDuration}
                        isActiveSlide={isActiveTheme}
                      />
                    </div>
                  </div>

                  <p className={styles.socialProofText}>{themeItem.socialProofText}</p>

                  <div className={styles.navSlot}>
                    <MerchantNav
                      merchants={merchants}
                      activeIndex={activeIndex}
                      onSelect={(index) => setActiveIndex(index)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showDebugControls ? (
        <ConfigPopover
          spacing={orbitSpacing}
          sideCassetteOffsetY={sideCassetteOffsetY}
          textMorphDuration={textMorphDuration}
          textMorphEase={textMorphEase}
          textMorphEaseString={textMorphEaseString}
          playbackPulseDuration={playbackPulseDuration}
          themeSpacing={themeSpacing}
          showGridOverlay={showGridOverlay}
          isOpen={isConfigOpen}
          onToggle={() => setIsConfigOpen((open) => !open)}
          onSpacingChange={(value) => setOrbitSpacing(value)}
          onThemeSpacingChange={(value) => setThemeSpacing(value)}
          onSideCassetteOffsetYChange={(value) => setSideCassetteOffsetY(value)}
          onTextMorphDurationChange={(value) => setTextMorphDuration(value)}
          onPlaybackPulseDurationChange={(value) => setPlaybackPulseDuration(value)}
          onShowGridOverlayChange={(value) => setShowGridOverlay(value)}
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
