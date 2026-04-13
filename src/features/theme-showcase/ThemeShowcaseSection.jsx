import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import quoteMarksSrc from "../../../Quotes.svg";
import ConfigPopover from "./ConfigPopover";
import MerchantNav from "./MerchantNav";
import PlayerStage from "./PlayerStage";
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
const FIRST_THEME_FRAME_START = 100;
const FIRST_THEME_FRAME_REVEAL_DISTANCE = 200;
const FIRST_THEME_FRAME_HOLD_DISTANCE = 300;
const FIRST_THEME_FRAME_EXIT_DISTANCE = 80;
const DETAIL_FRAME_REVEAL_DISTANCE = 100;
const DETAIL_FRAME_HOLD_DISTANCE = 300;
const DETAIL_FRAME_EXIT_DISTANCE = 80;
const FINAL_THEME_DWELL_DISTANCE = 220;
const FRAME_WILL_CHANGE_DISTANCE = 500;

function buildThemeTimeline(themeItems) {
  let cursor = FIRST_THEME_FRAME_START;

  return themeItems.map((themeItem, index) => {
    const titleRevealStart = cursor;
    const titleRevealEnd = titleRevealStart + FIRST_THEME_FRAME_REVEAL_DISTANCE;
    const titleHoldEnd = titleRevealEnd + FIRST_THEME_FRAME_HOLD_DISTANCE;
    const titleExitEnd = titleHoldEnd + FIRST_THEME_FRAME_EXIT_DISTANCE;

    const detailRevealStart = titleExitEnd;
    const detailRevealEnd = detailRevealStart + DETAIL_FRAME_REVEAL_DISTANCE;
    const isLast = index === themeItems.length - 1;
    const detailHoldEnd =
      detailRevealEnd + (isLast ? FINAL_THEME_DWELL_DISTANCE : DETAIL_FRAME_HOLD_DISTANCE);
    const detailExitEnd = isLast ? detailHoldEnd : detailHoldEnd + DETAIL_FRAME_EXIT_DISTANCE;

    cursor = detailExitEnd;

    return {
      themeItem,
      isLast,
      titleRevealStart,
      titleRevealEnd,
      titleHoldEnd,
      titleExitEnd,
      detailRevealStart,
      detailRevealEnd,
      detailHoldEnd,
      detailExitEnd,
    };
  });
}

function getScrollFlags({
  latest,
  activeStart,
  activeEnd,
  proximityDistance = FRAME_WILL_CHANGE_DISTANCE,
  isPersistent = false,
}) {
  const isVisible = isPersistent
    ? latest >= activeStart
    : latest >= activeStart && latest < activeEnd;
  const isNearActive =
    latest >= activeStart - proximityDistance && latest < activeEnd + proximityDistance;

  return { isVisible, isNearActive };
}

function useFrameScrollFlags({
  scrollY,
  activeStart,
  activeEnd,
  proximityDistance = FRAME_WILL_CHANGE_DISTANCE,
  isPersistent = false,
}) {
  const [flags, setFlags] = useState(() =>
    getScrollFlags({
      latest: scrollY.get(),
      activeStart,
      activeEnd,
      proximityDistance,
      isPersistent,
    }),
  );

  useEffect(() => {
    setFlags((previous) => {
      const next = getScrollFlags({
        latest: scrollY.get(),
        activeStart,
        activeEnd,
        proximityDistance,
        isPersistent,
      });

      return previous.isVisible === next.isVisible && previous.isNearActive === next.isNearActive
        ? previous
        : next;
    });
  }, [scrollY, activeStart, activeEnd, proximityDistance, isPersistent]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = getScrollFlags({
      latest,
      activeStart,
      activeEnd,
      proximityDistance,
      isPersistent,
    });

    setFlags((previous) =>
      previous.isVisible === next.isVisible && previous.isNearActive === next.isNearActive
        ? previous
        : next,
    );
  });

  return flags;
}

function ThemeTitleMotionFrame({
  themeItem,
  timelineItem,
  shellTrackStart,
  scrollY,
  prefersReducedMotion,
}) {
  const titleRevealStart = shellTrackStart + timelineItem.titleRevealStart;
  const titleRevealEnd = shellTrackStart + timelineItem.titleRevealEnd;
  const titleHoldEnd = shellTrackStart + timelineItem.titleHoldEnd;
  const titleExitEnd = shellTrackStart + timelineItem.titleExitEnd;
  const { isVisible, isNearActive } = useFrameScrollFlags({
    scrollY,
    activeStart: titleRevealStart,
    activeEnd: titleExitEnd,
  });
  const opacity = useTransform(
    scrollY,
    [titleRevealStart, titleRevealEnd, titleHoldEnd, titleExitEnd],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    scrollY,
    [titleRevealStart, titleRevealEnd, titleHoldEnd, titleExitEnd],
    [24, 0, 0, -24],
  );

  return (
    <motion.div
      className={styles.shellTextFrame}
      style={
        prefersReducedMotion
          ? {
              "--shell-player-panel": themeItem.playerPanelColor,
              ...(themeItem.eyebrowColor && { "--shell-kicker": themeItem.eyebrowColor }),
              ...(themeItem.accentColor && { "--shell-accent": themeItem.accentColor }),
              opacity: isVisible ? 1 : 0,
              visibility: isVisible ? "visible" : "hidden",
              pointerEvents: "none",
            }
          : {
              "--shell-player-panel": themeItem.playerPanelColor,
              ...(themeItem.eyebrowColor && { "--shell-kicker": themeItem.eyebrowColor }),
              ...(themeItem.accentColor && { "--shell-accent": themeItem.accentColor }),
              opacity,
              y,
              visibility: isVisible ? "visible" : "hidden",
              pointerEvents: "none",
              willChange: isNearActive ? "opacity, transform" : "auto",
            }
      }
    >
      <p className={styles.shellIndex}>{themeItem.indexLabel}</p>
      <h3 className={styles.shellTitle}>{themeItem.title}</h3>
    </motion.div>
  );
}

function ThemeDetailMotionFrame({
  themeItem,
  timelineItem,
  shellTrackStart,
  scrollY,
  prefersReducedMotion,
  shellPlayerScale,
  merchantsById,
  orbitSpacing,
  sideCassetteOffsetY,
  textMorphDuration,
  textMorphEaseString,
  playbackPulseDuration,
}) {
  const detailRevealStart = shellTrackStart + timelineItem.detailRevealStart;
  const detailRevealEnd = shellTrackStart + timelineItem.detailRevealEnd;
  const detailHoldEnd = shellTrackStart + timelineItem.detailHoldEnd;
  const detailExitEnd = shellTrackStart + timelineItem.detailExitEnd;
  const opacity = useTransform(
    scrollY,
    timelineItem.isLast
      ? [detailRevealStart, detailRevealEnd]
      : [detailRevealStart, detailRevealEnd, detailHoldEnd, detailExitEnd],
    timelineItem.isLast ? [0, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    scrollY,
    timelineItem.isLast
      ? [detailRevealStart, detailRevealEnd]
      : [detailRevealStart, detailRevealEnd, detailHoldEnd, detailExitEnd],
    timelineItem.isLast ? [24, 0] : [24, 0, 0, -24],
  );
  const { isVisible, isNearActive } = useFrameScrollFlags({
    scrollY,
    activeStart: detailRevealStart,
    activeEnd: detailExitEnd,
    isPersistent: timelineItem.isLast,
  });

  return (
    <motion.div
      className={styles.shellDetailFrame}
      aria-hidden={!isVisible}
      style={
        prefersReducedMotion
          ? {
              "--shell-player-scale": shellPlayerScale.toFixed(3),
              "--shell-player-panel": themeItem.playerPanelColor,
              ...(themeItem.eyebrowColor && { "--shell-kicker": themeItem.eyebrowColor }),
              ...(themeItem.accentColor && { "--shell-accent": themeItem.accentColor }),
              visibility: isVisible ? "visible" : "hidden",
              pointerEvents: isVisible ? "auto" : "none",
            }
          : {
              "--shell-player-scale": shellPlayerScale.toFixed(3),
              "--shell-player-panel": themeItem.playerPanelColor,
              ...(themeItem.eyebrowColor && { "--shell-kicker": themeItem.eyebrowColor }),
              ...(themeItem.accentColor && { "--shell-accent": themeItem.accentColor }),
              opacity,
              y,
              visibility: isVisible ? "visible" : "hidden",
              pointerEvents: isVisible ? "auto" : "none",
              willChange: isNearActive ? "opacity, transform" : "auto",
            }
      }
    >
      <ThemeDetailFrame
        themeItem={themeItem}
        merchantsById={merchantsById}
        orbitSpacing={orbitSpacing}
        sideCassetteOffsetY={sideCassetteOffsetY}
        textMorphDuration={textMorphDuration}
        textMorphEaseString={textMorphEaseString}
        playbackPulseDuration={playbackPulseDuration}
        isVisible={isVisible}
      />
    </motion.div>
  );
}

function ThemeDetailFrame({
  themeItem,
  merchantsById,
  orbitSpacing,
  sideCassetteOffsetY,
  textMorphDuration,
  textMorphEaseString,
  playbackPulseDuration,
  isVisible,
}) {
  const playbackAudioRef = useRef(null);
  const appPlaybackRef = useRef(false);
  const [activeMerchantIndex, setActiveMerchantIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const themeMerchants = useMemo(() => {
    if (!themeItem?.merchantIds?.length) {
      return [];
    }

    return themeItem.merchantIds.map((merchantId) => merchantsById.get(merchantId)).filter(Boolean);
  }, [themeItem, merchantsById]);

  const safeActiveMerchantIndex =
    themeMerchants.length > 0 ? Math.min(activeMerchantIndex, themeMerchants.length - 1) : 0;
  const activeMerchant = themeMerchants[safeActiveMerchantIndex] ?? null;

  useEffect(() => {
    setActiveMerchantIndex((current) =>
      themeMerchants.length > 0 ? Math.min(current, themeMerchants.length - 1) : 0,
    );
  }, [themeMerchants.length]);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const audio = playbackAudioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setPlaybackTime(0);
    setIsPlaying(false);
  }, [isVisible]);

  useEffect(() => {
    const audio = playbackAudioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setPlaybackTime(0);
    setIsPlaying(false);
  }, [activeMerchant?.id]);

  useEffect(() => {
    const audio = playbackAudioRef.current;

    if (!audio) {
      return undefined;
    }

    const handlePlay = () => {
      if (!appPlaybackRef.current) {
        audio.pause();
        return;
      }
      appPlaybackRef.current = false;
      setIsPlaying(true);
    };
    const handlePause = () => {
      if (!appPlaybackRef.current) return;
      appPlaybackRef.current = false;
      setIsPlaying(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setPlaybackTime(0);
    };
    const handleTimeUpdate = () => {
      setPlaybackTime(audio.currentTime);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [activeMerchant?.id]);

  async function handleTogglePlayback() {
    const audio = playbackAudioRef.current;

    if (!audio || !activeMerchant?.playbackAudioSrc) {
      setIsPlaying((current) => !current);
      return;
    }

    appPlaybackRef.current = true;

    if (audio.paused) {
      if (audio.ended) {
        audio.currentTime = 0;
      }

      await audio.play();
      return;
    }

    audio.pause();
  }

  if (!themeItem || !activeMerchant) {
    return null;
  }

  return (
    <>
      <div className={styles.shellDetailCopy}>
        <p className={styles.shellDetailKicker}>
          {`${themeItem.indexLabel} ${themeItem.title}`}
        </p>
        <div className={styles.shellMerchantSummary}>
          <div
            className={`${styles.shellSummaryLayer} ${
              isPlaying ? styles.shellSummaryLayerHidden : styles.shellSummaryLayerVisible
            }`}
          >
            <h3 className={styles.shellMerchantName}>{activeMerchant.name}</h3>
            <p className={styles.shellMerchantBody}>
              {activeMerchant.copy.map((segment, index) => {
                if (typeof segment === "string") {
                  return <span key={`${activeMerchant.id}-copy-${index}`}>{segment}</span>;
                }

                return (
                  <span
                    key={`${activeMerchant.id}-copy-${index}`}
                    className={styles.shellMerchantHighlight}
                  >
                    {segment.highlight}
                  </span>
                );
              })}
            </p>
          </div>

          <div
            className={`${styles.shellQuoteLayer} ${
              isPlaying ? styles.shellQuoteLayerVisible : styles.shellQuoteLayerHidden
            }`}
            aria-hidden={!isPlaying}
          >
            <img
              className={styles.shellQuoteMark}
              src={quoteMarksSrc}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
            />
            <div className={styles.shellQuoteContent}>
              {activeMerchant.playbackQuote?.segments ? (
                <p className={styles.shellQuoteText}>
                  {activeMerchant.playbackQuote.segments.map((segment, index) => {
                    const isActive = playbackTime >= segment.start && playbackTime < segment.end;
                    const hasPlayed = playbackTime >= segment.end;

                    return (
                      <Fragment key={`${activeMerchant.id}-quote-segment-${index}`}>
                        <span
                          className={`${styles.shellQuoteSegment} ${
                            isActive
                              ? styles.shellQuoteSegmentActive
                              : hasPlayed
                                ? styles.shellQuoteSegmentPlayed
                                : styles.shellQuoteSegmentUpcoming
                          }`}
                        >
                          {segment.text}
                        </span>{" "}
                      </Fragment>
                    );
                  })}
                </p>
              ) : (
                <p className={styles.shellQuoteText}>
                  <span className={styles.shellQuoteLead}>{activeMerchant.playbackQuote?.lead}</span>
                  <span className={styles.shellQuoteRest}>{activeMerchant.playbackQuote?.rest}</span>
                </p>
              )}

              <div className={styles.shellQuoteAttribution}>
                <p className={styles.shellQuoteSpeaker}>{activeMerchant.playbackQuote?.speakerName}</p>
                <p className={styles.shellQuoteRole}>{activeMerchant.playbackQuote?.speakerRole}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.shellMerchantFooter}>
          <p className={styles.shellMerchantSupport}>
            {themeItem.socialProofText ?? "We heard this from others too"}
          </p>
          <div className={styles.shellMerchantNavTheme}>
            <MerchantNav
              merchants={themeMerchants}
              activeIndex={safeActiveMerchantIndex}
              onSelect={setActiveMerchantIndex}
              className={styles.shellMerchantNav}
              variant="dark"
            />
          </div>
        </div>
      </div>

      <div className={styles.shellDetailPlayer}>
        <div className={styles.shellPlayerStage}>
          <div className={styles.shellPlayerStageVisual}>
            <PlayerStage
              merchants={themeMerchants}
              activeIndex={safeActiveMerchantIndex}
              activeMerchant={activeMerchant}
              isPlaying={isPlaying}
              onTogglePlayback={handleTogglePlayback}
              onActiveIndexChange={setActiveMerchantIndex}
              spacing={orbitSpacing}
              sideOffsetY={sideCassetteOffsetY}
              textMorphDuration={textMorphDuration}
              textMorphEase={textMorphEaseString}
              playbackPulseDuration={playbackPulseDuration}
              isPrimaryInstance={false}
              panelColor={themeItem.playerPanelColor}
            />
          </div>
        </div>
        <audio
          key={activeMerchant.id}
          ref={playbackAudioRef}
          src={activeMerchant.playbackAudioSrc}
          preload="metadata"
          aria-hidden="true"
        />
      </div>
    </>
  );
}

function ThemeShowcaseSection({
  theme,
  themes,
  merchants = [],
  showDebugControls = true,
  overviewSceneOffsetX = 0,
  overviewSceneOffsetY = 0,
  overviewSceneScale = 1,
  showOverviewSceneFrame = false,
  showSideNav = false,
  merchantHoverPreviewSize = 760,
  showRoadmapLabelMotion = true,
  showRoadmapInlineLabels = false,
  onOverviewSceneOffsetXChange = () => {},
  onOverviewSceneOffsetYChange = () => {},
  onOverviewSceneScaleChange = () => {},
  onShowOverviewSceneFrameChange = () => {},
  onShowSideNavChange = () => {},
  onMerchantHoverPreviewSizeChange = () => {},
  onShowRoadmapLabelMotionChange = () => {},
  onShowRoadmapInlineLabelsChange = () => {},
}) {
  const shellTrackRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [shellTrackStart, setShellTrackStart] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [showStickyGuide, setShowStickyGuide] = useState(false);
  const [orbitSpacing, setOrbitSpacing] = useState(DEFAULT_ORBIT_SPACING);
  const [sideCassetteOffsetY, setSideCassetteOffsetY] = useState(DEFAULT_SIDE_CASSETTE_OFFSET_Y);
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
  const themeList = themes?.length ? themes : theme ? [theme] : [];
  const merchantsById = useMemo(
    () => new Map(merchants.map((merchantItem) => [merchantItem.id, merchantItem])),
    [merchants],
  );
  const sectionHeading =
    themeList[0]?.sectionHeading ??
    "We heard a few things across our conversations and we'd like you to hear them too";
  const themeTimeline = useMemo(() => buildThemeTimeline(themeList), [themeList]);
  const { scrollYProgress } = useScroll({
    target: shellTrackRef,
    offset: ["start end", "start start"],
  });
  const { scrollY } = useScroll();

  const shellScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const shellY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const shellRadius = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const shellSequenceEnd =
    themeTimeline.length > 0 ? themeTimeline[themeTimeline.length - 1].detailHoldEnd : 0;
  const textMorphEaseString = useMemo(
    () => `cubic-bezier(${textMorphEase.join(", ")})`,
    [textMorphEase],
  );
  const shellPlayerScale = useMemo(() => {
    if (!viewportHeight) {
      return 1;
    }

    return Math.max(0.86, Math.min(1, (viewportHeight - 240) / 620));
  }, [viewportHeight]);

  useEffect(() => {
    function updateShellMetrics() {
      const shellTrack = shellTrackRef.current;

      if (!shellTrack) {
        return;
      }

      setShellTrackStart(shellTrack.getBoundingClientRect().top + window.scrollY);
      setViewportHeight(window.innerHeight);
    }

    updateShellMetrics();
    window.addEventListener("resize", updateShellMetrics, { passive: true });

    return () => {
      window.removeEventListener("resize", updateShellMetrics);
    };
  }, []);

  return (
    <section
      className={styles.shellSection}
      data-show-grid={showGridOverlay ? "true" : "false"}
      data-show-sticky-guide={showStickyGuide ? "true" : "false"}
      aria-label="Theme redesign workspace"
    >
      <div className={styles.stickyGuide} />
      <div className={styles.gridOverlay} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <div className={styles.gridOverlayColumn} key={`theme-grid-${index}`} />
        ))}
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
          merchantHoverPreviewSize={merchantHoverPreviewSize}
          showRoadmapLabelMotion={showRoadmapLabelMotion}
          showRoadmapInlineLabels={showRoadmapInlineLabels}
          showGridOverlay={showGridOverlay}
          showStickyGuide={showStickyGuide}
          isOpen={isConfigOpen}
          onToggle={() => setIsConfigOpen((current) => !current)}
          onClose={() => setIsConfigOpen(false)}
          onSpacingChange={setOrbitSpacing}
          onThemeSpacingChange={setThemeSpacing}
          onThemeHoldDistanceChange={setThemeHoldDistance}
          onCurrentCardExitScaleChange={setCurrentCardExitScale}
          onCurrentCardExitBlurChange={setCurrentCardExitBlur}
          onCurrentCardExitCompleteAtChange={setCurrentCardExitCompleteAt}
          onFooterSwitchAtChange={setFooterSwitchAt}
          onOverviewSceneOffsetXChange={onOverviewSceneOffsetXChange}
          onOverviewSceneOffsetYChange={onOverviewSceneOffsetYChange}
          onOverviewSceneScaleChange={onOverviewSceneScaleChange}
          onShowOverviewSceneFrameChange={onShowOverviewSceneFrameChange}
          onShowSideNavChange={onShowSideNavChange}
          onMerchantHoverPreviewSizeChange={onMerchantHoverPreviewSizeChange}
          onShowRoadmapLabelMotionChange={onShowRoadmapLabelMotionChange}
          onShowRoadmapInlineLabelsChange={onShowRoadmapInlineLabelsChange}
          onSideCassetteOffsetYChange={setSideCassetteOffsetY}
          onTextMorphDurationChange={setTextMorphDuration}
          onPlaybackPulseDurationChange={setPlaybackPulseDuration}
          onShowGridOverlayChange={setShowGridOverlay}
          onShowStickyGuideChange={setShowStickyGuide}
          onTextMorphEaseChange={setTextMorphEase}
        />
      ) : null}

      <div className={styles.shellHeader}>
        <p className={styles.eyebrow}>We brought receipts</p>
        <h2 className={styles.heading}>{sectionHeading}</h2>
      </div>
      <div
        ref={shellTrackRef}
        className={styles.shellTrack}
        style={viewportHeight ? { height: `${viewportHeight + shellSequenceEnd}px` } : undefined}
      >
        <div className={styles.shellViewport}>
          <motion.div
            className={styles.shellSurface}
            style={
              prefersReducedMotion
                ? undefined
                : {
                    scale: shellScale,
                    y: shellY,
                    borderRadius: shellRadius,
                    willChange: "transform, border-radius",
                  }
            }
          >
            <div className={styles.shellCanvas}>
              <div className={styles.shellScene}>
                {themeTimeline.map((timelineItem) => (
                  <Fragment key={timelineItem.themeItem.id}>
                    <ThemeTitleMotionFrame
                      themeItem={timelineItem.themeItem}
                      timelineItem={timelineItem}
                      shellTrackStart={shellTrackStart}
                      scrollY={scrollY}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                    <ThemeDetailMotionFrame
                      themeItem={timelineItem.themeItem}
                      timelineItem={timelineItem}
                      shellTrackStart={shellTrackStart}
                      scrollY={scrollY}
                      prefersReducedMotion={prefersReducedMotion}
                      shellPlayerScale={shellPlayerScale}
                      merchantsById={merchantsById}
                      orbitSpacing={orbitSpacing}
                      sideCassetteOffsetY={sideCassetteOffsetY}
                      textMorphDuration={textMorphDuration}
                      textMorphEaseString={textMorphEaseString}
                      playbackPulseDuration={playbackPulseDuration}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ThemeShowcaseSection;
