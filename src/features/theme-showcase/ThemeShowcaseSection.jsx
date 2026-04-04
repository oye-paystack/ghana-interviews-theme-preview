import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  const [firstThemeSlideHeight, setFirstThemeSlideHeight] = useState(815);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [activeIndicesByThemeId, setActiveIndicesByThemeId] = useState(() =>
    Object.fromEntries(
      themeList.map((themeItem) => [themeItem.id, clampIndex(initialActiveIndex, merchants.length)]),
    ),
  );
  const slideRefs = useRef([]);
  const merchantsById = useMemo(
    () => Object.fromEntries(merchants.map((merchantItem) => [merchantItem.id, merchantItem])),
    [merchants],
  );

  useEffect(() => {
    setActiveIndicesByThemeId((current) => {
      const next = { ...current };

      themeList.forEach((themeItem) => {
        if (typeof next[themeItem.id] !== "number") {
          next[themeItem.id] = 0;
        }
      });

      return next;
    });
  }, [themeList]);

  useEffect(() => {
    function updateActiveTheme() {
      const desktopStickyTop = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--desktop-side-nav-top"),
      );
      const stickyTop = Number.isFinite(desktopStickyTop) ? desktopStickyTop : 48;
      let nextThemeIndex = 0;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) {
          return;
        }

        const { top } = slide.getBoundingClientRect();

        if (top <= stickyTop + 1) {
          nextThemeIndex = index;
        }
      });

      setActiveThemeIndex((currentIndex) =>
        currentIndex === nextThemeIndex ? currentIndex : nextThemeIndex,
      );
    }

    updateActiveTheme();
    window.addEventListener("scroll", updateActiveTheme, { passive: true });
    window.addEventListener("resize", updateActiveTheme, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveTheme);
      window.removeEventListener("resize", updateActiveTheme);
    };
  }, [themeList]);

  useEffect(() => {
    const firstSlide = slideRefs.current[0];

    if (!firstSlide) {
      return undefined;
    }

    function updateFirstSlideHeight() {
      const nextHeight = Math.round(firstSlide.offsetHeight);

      setFirstThemeSlideHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      );
    }

    updateFirstSlideHeight();

    const resizeObserver =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(updateFirstSlideHeight)
        : null;

    resizeObserver?.observe(firstSlide);
    window.addEventListener("resize", updateFirstSlideHeight, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateFirstSlideHeight);
    };
  }, [themeList]);

  const activeTheme = themeList[activeThemeIndex] ?? themeList[0];
  const resolvedActiveThemeMerchants = (activeTheme?.merchantIds ?? [])
    .map((merchantId) => merchantsById[merchantId])
    .filter(Boolean);
  const activeThemeMerchants = resolvedActiveThemeMerchants.length
    ? resolvedActiveThemeMerchants
    : merchants;
  const activeThemeMerchantIndex = clampIndex(
    activeIndicesByThemeId[activeTheme?.id] ?? 0,
    activeThemeMerchants.length,
  );
  const sectionHeadingId = `${themeList[0]?.id ?? "theme-showcase"}-heading`;
  const textMorphEaseString = `cubic-bezier(${textMorphEase.join(", ")})`;

  const sectionStyle = {
    "--orbit-spacing": `${orbitSpacing}px`,
    "--theme-slide-gap": `${themeSpacing}px`,
    "--first-theme-slide-height": `${firstThemeSlideHeight}px`,
  };

  return (
    <section
      className={styles.section}
      style={sectionStyle}
      aria-labelledby={sectionHeadingId}
      data-testid="theme-showcase-section"
      data-show-grid={showGridOverlay ? "true" : "false"}
    >
      <div className={styles.stage}>
        <div className={styles.stickyGuide} aria-hidden="true" />

        <div className={styles.gridOverlay} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <span className={styles.gridOverlayColumn} key={`grid-column-${index}`} />
          ))}
        </div>

        <h1 className={styles.heading} id={sectionHeadingId}>
          {themeList[0]?.sectionHeading}
        </h1>

        <div className={styles.themeList}>
          {themeList.map((themeItem, themeIndex) => {
            const themeMerchants = (themeItem.merchantIds ?? [])
              .map((merchantId) => merchantsById[merchantId])
              .filter(Boolean);
            const resolvedThemeMerchants = themeMerchants.length ? themeMerchants : merchants;
            const themeActiveIndex = clampIndex(
              activeIndicesByThemeId[themeItem.id] ?? 0,
              resolvedThemeMerchants.length,
            );
            const themeActiveMerchant = resolvedThemeMerchants[themeActiveIndex];

            return (
              <Fragment key={themeItem.id}>
                <div
                  className={styles.themeSlide}
                  style={{ "--theme-layer": themeIndex + 1 }}
                  ref={(element) => {
                    slideRefs.current[themeIndex] = element;
                  }}
                >
                  <div
                    className={styles.card}
                    style={{
                      "--theme-player-panel": themeItem.playerPanelColor,
                    }}
                  >
                    <div
                      className={styles.tag}
                      aria-label={`Theme ${themeItem.indexLabel} title`}
                    >
                      <span className={styles.tagIndex}>{themeItem.indexLabel}</span>
                      <span className={styles.tagText}>{themeItem.title}</span>
                    </div>

                    <div className={styles.cardBody}>
                      <PlaybackPanels
                        merchants={resolvedThemeMerchants}
                        activeIndex={themeActiveIndex}
                        activeMerchant={themeActiveMerchant}
                        orbitSpacing={orbitSpacing}
                        sideCassetteOffsetY={sideCassetteOffsetY}
                        textMorphDuration={textMorphDuration}
                        textMorphEaseString={textMorphEaseString}
                        playbackPulseDuration={playbackPulseDuration}
                        isActiveSlide={themeIndex === activeThemeIndex}
                      />
                    </div>
                  </div>
                </div>

                {themeIndex === 0 ? (
                  <div className={styles.sharedFooter}>
                    <p className={styles.socialProofText}>{activeTheme?.socialProofText}</p>

                    <div className={styles.navSlot}>
                      <MerchantNav
                        merchants={activeThemeMerchants}
                        activeIndex={activeThemeMerchantIndex}
                        onSelect={(index) =>
                          setActiveIndicesByThemeId((current) => ({
                            ...current,
                            [activeTheme.id]: index,
                          }))
                        }
                      />
                    </div>
                  </div>
                ) : null}
              </Fragment>
            );
          })}
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
