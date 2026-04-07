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
const DEFAULT_THEME_HOLD_DISTANCE = 88;
const DEFAULT_EXIT_SCALE = 0.95;
const DEFAULT_EXIT_BLUR = 0;
const DEFAULT_EXIT_COMPLETE_AT = 0.77;
const DEFAULT_FOOTER_SWITCH_AT = 0.92;
const FINAL_THEME_DWELL = 120;
const SHARED_FOOTER_BLOCK_HEIGHT = 120;
const INITIAL_CARD_HEIGHT = 815;

function clampIndex(value, length) {
  if (length <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), length - 1);
}

function getPageTop(element) {
  let top = 0;
  let node = element;

  while (node) {
    top += node.offsetTop;
    node = node.offsetParent;
  }

  return top;
}

function ThemeShowcaseSection({
  theme,
  themes,
  merchants,
  initialActiveIndex = 0,
  showDebugControls = true,
  overviewSceneOffsetX = 0,
  overviewSceneOffsetY = 0,
  overviewSceneScale = 1,
  showOverviewSceneFrame = false,
  showSideNav = false,
  onOverviewSceneOffsetXChange = () => {},
  onOverviewSceneOffsetYChange = () => {},
  onOverviewSceneScaleChange = () => {},
  onShowOverviewSceneFrameChange = () => {},
  onShowSideNavChange = () => {},
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
  const [themeHoldDistance, setThemeHoldDistance] = useState(DEFAULT_THEME_HOLD_DISTANCE);
  const [currentCardExitScale, setCurrentCardExitScale] = useState(DEFAULT_EXIT_SCALE);
  const [currentCardExitBlur, setCurrentCardExitBlur] = useState(DEFAULT_EXIT_BLUR);
  const [currentCardExitCompleteAt, setCurrentCardExitCompleteAt] = useState(
    DEFAULT_EXIT_COMPLETE_AT,
  );
  const [footerSwitchAt, setFooterSwitchAt] = useState(DEFAULT_FOOTER_SWITCH_AT);
  const [cardHeight, setCardHeight] = useState(INITIAL_CARD_HEIGHT);
  const [nextCardOffsetY, setNextCardOffsetY] = useState(
    INITIAL_CARD_HEIGHT + SHARED_FOOTER_BLOCK_HEIGHT + DEFAULT_THEME_SPACING,
  );
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [showStickyGuide, setShowStickyGuide] = useState(false);
  const [hasPinnedStageInitialized, setHasPinnedStageInitialized] = useState(false);
  const [activeIndicesByThemeId, setActiveIndicesByThemeId] = useState(() =>
    Object.fromEntries(
      themeList.map((themeItem) => [themeItem.id, clampIndex(initialActiveIndex, merchants.length)]),
    ),
  );
  const browserRef = useRef(null);
  const currentCardRef = useRef(null);
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
    const currentCard = currentCardRef.current;

    if (!currentCard) {
      return undefined;
    }

    function updateCardHeight() {
      const nextHeight = Math.round(currentCard.offsetHeight);

      setCardHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      );
    }

    updateCardHeight();

    const resizeObserver =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(updateCardHeight)
        : null;

    resizeObserver?.observe(currentCard);
    window.addEventListener("resize", updateCardHeight, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateCardHeight);
    };
  }, [activeThemeIndex, themeSpacing]);

  const parkedNextCardY = cardHeight + SHARED_FOOTER_BLOCK_HEIGHT + themeSpacing;
  const transitionDistance = themeHoldDistance + parkedNextCardY;
  const totalPinnedDistance = Math.max(
    0,
    (themeList.length - 1) * transitionDistance + FINAL_THEME_DWELL,
  );
  const stickyStageHeight = parkedNextCardY;

  useEffect(() => {
    function updatePinnedStage() {
      const browser = browserRef.current;

      if (!browser) {
        return;
      }

      setHasPinnedStageInitialized((current) => (current ? current : true));

      const desktopStickyTop = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--desktop-side-nav-top"),
      );
      const stickyTop = Number.isFinite(desktopStickyTop) ? desktopStickyTop : 48;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const pinStart = Math.max(0, getPageTop(browser) - stickyTop);
      const localScroll = Math.max(0, Math.min(totalPinnedDistance, scrollY - pinStart));

      if (themeList.length <= 1) {
        setActiveThemeIndex(0);
        setNextCardOffsetY(parkedNextCardY);
        return;
      }

      const completedTransitions = Math.min(
        Math.floor(localScroll / transitionDistance),
        themeList.length - 1,
      );

      if (completedTransitions >= themeList.length - 1) {
        setActiveThemeIndex(themeList.length - 1);
        setNextCardOffsetY(parkedNextCardY);
        return;
      }

      const progressWithinTransition = localScroll - completedTransitions * transitionDistance;
      const nextOffset =
        progressWithinTransition <= themeHoldDistance
          ? parkedNextCardY
          : Math.max(0, parkedNextCardY - (progressWithinTransition - themeHoldDistance));

      setActiveThemeIndex((currentIndex) =>
        currentIndex === completedTransitions ? currentIndex : completedTransitions,
      );
      setNextCardOffsetY((currentOffset) =>
        Math.abs(currentOffset - nextOffset) > 0.5 ? nextOffset : currentOffset,
      );
    }

    updatePinnedStage();
    window.addEventListener("scroll", updatePinnedStage, { passive: true });
    window.addEventListener("resize", updatePinnedStage, { passive: true });

    return () => {
      window.removeEventListener("scroll", updatePinnedStage);
      window.removeEventListener("resize", updatePinnedStage);
    };
  }, [parkedNextCardY, themeHoldDistance, themeList, totalPinnedDistance, transitionDistance]);

  function getThemeContext(themeItem) {
    const themeMerchants = (themeItem?.merchantIds ?? [])
      .map((merchantId) => merchantsById[merchantId])
      .filter(Boolean);
    const resolvedThemeMerchants = themeMerchants.length ? themeMerchants : merchants;
    const themeActiveIndex = clampIndex(
      activeIndicesByThemeId[themeItem?.id] ?? 0,
      resolvedThemeMerchants.length,
    );
    const themeActiveMerchant = resolvedThemeMerchants[themeActiveIndex];

    return {
      merchants: resolvedThemeMerchants,
      activeIndex: themeActiveIndex,
      activeMerchant: themeActiveMerchant,
    };
  }

  const activeTheme = themeList[activeThemeIndex] ?? themeList[0];
  const nextTheme = themeList[activeThemeIndex + 1] ?? null;
  const futureThemes = themeList.slice(activeThemeIndex + 2);
  const activeThemeContext = getThemeContext(activeTheme);
  const nextThemeContext = nextTheme ? getThemeContext(nextTheme) : null;
  const sectionHeadingId = `${themeList[0]?.id ?? "theme-showcase"}-heading`;
  const textMorphEaseString = `cubic-bezier(${textMorphEase.join(", ")})`;
  const nextCardRiseProgress =
    hasPinnedStageInitialized && nextTheme && parkedNextCardY > 0
      ? Math.max(0, Math.min(1, (parkedNextCardY - nextCardOffsetY) / parkedNextCardY))
      : 0;
  const footerThemeIndex =
    nextTheme && nextCardRiseProgress >= footerSwitchAt ? activeThemeIndex + 1 : activeThemeIndex;
  const footerTheme = themeList[footerThemeIndex] ?? activeTheme;
  const footerThemeContext = getThemeContext(footerTheme);
  const currentCardExitProgress = Math.max(
    0,
    Math.min(1, nextCardRiseProgress / currentCardExitCompleteAt),
  );
  const currentCardScale =
    1 - currentCardExitProgress * (1 - currentCardExitScale);
  const currentCardOpacity = 1 - currentCardExitProgress;
  const currentCardBlur = currentCardExitProgress * currentCardExitBlur;

  const sectionStyle = {
    "--orbit-spacing": `${orbitSpacing}px`,
    "--theme-slide-gap": `${themeSpacing}px`,
    "--card-height": `${cardHeight}px`,
    "--parked-next-card-y": `${parkedNextCardY}px`,
    "--next-card-offset-y": `${nextCardOffsetY}px`,
    "--sticky-stage-height": `${stickyStageHeight}px`,
    "--pinned-scroll-distance": `${totalPinnedDistance}px`,
    "--theme-hold-distance": `${themeHoldDistance}px`,
    "--current-card-exit-scale": currentCardExitScale,
    "--current-card-exit-blur": `${currentCardExitBlur}px`,
    "--current-card-exit-complete-at": `${Math.round(currentCardExitCompleteAt * 100)}%`,
    "--footer-switch-at": `${Math.round(footerSwitchAt * 100)}%`,
  };

  return (
    <section
      className={styles.section}
      style={sectionStyle}
      aria-labelledby={sectionHeadingId}
      data-testid="theme-showcase-section"
      data-show-grid={showGridOverlay ? "true" : "false"}
      data-show-sticky-guide={showStickyGuide ? "true" : "false"}
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

        <div className={styles.themeBrowser} ref={browserRef}>
          <div className={styles.stickyStage}>
            {activeTheme ? (
              <div
                key={activeTheme.id}
                className={`${styles.cardLayer} ${styles.currentCardLayer} ${
                  currentCardBlur > 0 ? styles.currentCardLayerBlurred : ""
                }`}
                style={{
                  "--current-card-scale": currentCardScale,
                  "--current-card-opacity": currentCardOpacity,
                  ...(currentCardBlur > 0
                    ? { "--current-card-blur": `${currentCardBlur}px` }
                    : {}),
                }}
              >
                <div
                  className={styles.card}
                  ref={currentCardRef}
                  style={{
                    "--theme-player-panel": activeTheme.playerPanelColor,
                  }}
                >
                  <div
                    className={styles.tag}
                    aria-label={`Theme ${activeTheme.indexLabel} title`}
                  >
                    <span className={styles.tagIndex}>{activeTheme.indexLabel}</span>
                    <span className={styles.tagText}>{activeTheme.title}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <PlaybackPanels
                      key={activeTheme.id}
                      merchants={activeThemeContext.merchants}
                      activeIndex={activeThemeContext.activeIndex}
                      activeMerchant={activeThemeContext.activeMerchant}
                      orbitSpacing={orbitSpacing}
                      sideCassetteOffsetY={sideCassetteOffsetY}
                      textMorphDuration={textMorphDuration}
                      textMorphEaseString={textMorphEaseString}
                      playbackPulseDuration={playbackPulseDuration}
                      isActiveSlide
                      isPrimaryInstance
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className={styles.sharedFooter}>
              <p className={styles.socialProofText}>{footerTheme?.socialProofText}</p>

              <div className={styles.navSlot}>
                <MerchantNav
                  merchants={footerThemeContext.merchants}
                  activeIndex={footerThemeContext.activeIndex}
                  onSelect={(index) =>
                    setActiveIndicesByThemeId((current) => ({
                      ...current,
                      [footerTheme.id]: index,
                    }))
                  }
                />
              </div>
            </div>

            {nextTheme && nextThemeContext ? (
              <div
                key={nextTheme.id}
                className={`${styles.cardLayer} ${styles.nextCardLayer}`}
              >
                <div
                  className={styles.card}
                  style={{
                    "--theme-player-panel": nextTheme.playerPanelColor,
                  }}
                >
                  <div
                    className={styles.tag}
                    aria-label={`Theme ${nextTheme.indexLabel} title`}
                  >
                    <span className={styles.tagIndex}>{nextTheme.indexLabel}</span>
                    <span className={styles.tagText}>{nextTheme.title}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <PlaybackPanels
                      key={nextTheme.id}
                      merchants={nextThemeContext.merchants}
                      activeIndex={nextThemeContext.activeIndex}
                      activeMerchant={nextThemeContext.activeMerchant}
                      orbitSpacing={orbitSpacing}
                      sideCassetteOffsetY={sideCassetteOffsetY}
                      textMorphDuration={textMorphDuration}
                      textMorphEaseString={textMorphEaseString}
                      playbackPulseDuration={playbackPulseDuration}
                      isActiveSlide={false}
                      isPrimaryInstance={false}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {futureThemes.map((futureTheme, futureThemeIndex) => {
              const futureThemeContext = getThemeContext(futureTheme);
              const stackedOffsetMultiplier = futureThemeIndex + 1;

              return (
                <div
                  key={futureTheme.id}
                  className={`${styles.cardLayer} ${styles.futureCardLayer}`}
                  style={{
                    "--future-card-y": `calc(var(--next-card-offset-y) + ${
                      stackedOffsetMultiplier * parkedNextCardY
                    }px)`,
                    "--future-card-layer": 4 + futureThemeIndex,
                  }}
                >
                  <div
                    className={styles.card}
                    style={{
                      "--theme-player-panel": futureTheme.playerPanelColor,
                    }}
                  >
                    <div
                      className={styles.tag}
                      aria-label={`Theme ${futureTheme.indexLabel} title`}
                    >
                      <span className={styles.tagIndex}>{futureTheme.indexLabel}</span>
                      <span className={styles.tagText}>{futureTheme.title}</span>
                    </div>

                    <div className={styles.cardBody}>
                      <PlaybackPanels
                        key={futureTheme.id}
                        merchants={futureThemeContext.merchants}
                        activeIndex={futureThemeContext.activeIndex}
                        activeMerchant={futureThemeContext.activeMerchant}
                        orbitSpacing={orbitSpacing}
                        sideCassetteOffsetY={sideCassetteOffsetY}
                        textMorphDuration={textMorphDuration}
                        textMorphEaseString={textMorphEaseString}
                        playbackPulseDuration={playbackPulseDuration}
                        isActiveSlide={false}
                        isPrimaryInstance={false}
                      />
                    </div>
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
          themeHoldDistance={themeHoldDistance}
          currentCardExitScale={currentCardExitScale}
          currentCardExitBlur={currentCardExitBlur}
          currentCardExitCompleteAt={currentCardExitCompleteAt}
          footerSwitchAt={footerSwitchAt}
          overviewSceneOffsetX={overviewSceneOffsetX}
          overviewSceneOffsetY={overviewSceneOffsetY}
          overviewSceneScale={overviewSceneScale}
          showOverviewSceneFrame={showOverviewSceneFrame}
          showSideNav={showSideNav}
          showGridOverlay={showGridOverlay}
          showStickyGuide={showStickyGuide}
          isOpen={isConfigOpen}
          onToggle={() => setIsConfigOpen((open) => !open)}
          onClose={() => setIsConfigOpen(false)}
          onSpacingChange={(value) => setOrbitSpacing(value)}
          onThemeSpacingChange={(value) => setThemeSpacing(value)}
          onThemeHoldDistanceChange={(value) => setThemeHoldDistance(value)}
          onCurrentCardExitScaleChange={(value) => setCurrentCardExitScale(value)}
          onCurrentCardExitBlurChange={(value) => setCurrentCardExitBlur(value)}
          onCurrentCardExitCompleteAtChange={(value) =>
            setCurrentCardExitCompleteAt(value)
          }
          onFooterSwitchAtChange={(value) => setFooterSwitchAt(value)}
          onOverviewSceneOffsetXChange={onOverviewSceneOffsetXChange}
          onOverviewSceneOffsetYChange={onOverviewSceneOffsetYChange}
          onOverviewSceneScaleChange={onOverviewSceneScaleChange}
          onShowOverviewSceneFrameChange={onShowOverviewSceneFrameChange}
          onShowSideNavChange={onShowSideNavChange}
          onSideCassetteOffsetYChange={(value) => setSideCassetteOffsetY(value)}
          onTextMorphDurationChange={(value) => setTextMorphDuration(value)}
          onPlaybackPulseDurationChange={(value) => setPlaybackPulseDuration(value)}
          onShowGridOverlayChange={(value) => setShowGridOverlay(value)}
          onShowStickyGuideChange={(value) => setShowStickyGuide(value)}
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
