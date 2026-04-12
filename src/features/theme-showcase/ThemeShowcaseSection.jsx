import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
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
const FIRST_THEME_FRAME_HOLD_DISTANCE = 100;
const FIRST_THEME_FRAME_EXIT_DISTANCE = 80;

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
  const playbackAudioRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [shellTrackStart, setShellTrackStart] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [activeMerchantIndex, setActiveMerchantIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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
  const activeTheme = themeList[0] ?? null;
  const activeThemeMerchants = useMemo(() => {
    if (!activeTheme?.merchantIds?.length) {
      return merchants;
    }

    return activeTheme.merchantIds
      .map((merchantId) => merchantsById.get(merchantId))
      .filter(Boolean);
  }, [activeTheme, merchants, merchantsById]);
  const safeActiveMerchantIndex =
    activeThemeMerchants.length > 0
      ? Math.min(activeMerchantIndex, activeThemeMerchants.length - 1)
      : 0;
  const activeMerchant = activeThemeMerchants[safeActiveMerchantIndex] ?? null;
  const sectionHeading =
    themeList[0]?.sectionHeading ??
    "We heard a few things across our conversations and we'd like you to hear them too";
  const { scrollYProgress } = useScroll({
    target: shellTrackRef,
    offset: ["start end", "start start"],
  });
  const { scrollY } = useScroll();

  const shellScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const shellY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const shellRadius = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const firstFrameRevealStart = shellTrackStart + FIRST_THEME_FRAME_START;
  const firstFrameRevealEnd = firstFrameRevealStart + FIRST_THEME_FRAME_REVEAL_DISTANCE;
  const firstFrameHoldEnd = firstFrameRevealEnd + FIRST_THEME_FRAME_HOLD_DISTANCE;
  const firstFrameExitEnd = firstFrameHoldEnd + FIRST_THEME_FRAME_EXIT_DISTANCE;
  const firstFrameOpacity = useTransform(
    scrollY,
    [firstFrameRevealStart, firstFrameRevealEnd, firstFrameHoldEnd, firstFrameExitEnd],
    [0, 1, 1, 0],
  );
  const firstFrameY = useTransform(
    scrollY,
    [firstFrameRevealStart, firstFrameRevealEnd, firstFrameHoldEnd, firstFrameExitEnd],
    [24, 0, 0, -24],
  );
  const secondFrameOpacity = useTransform(
    scrollY,
    [firstFrameHoldEnd, firstFrameHoldEnd + 100],
    [0, 1],
  );
  const secondFrameY = useTransform(
    scrollY,
    [firstFrameHoldEnd, firstFrameHoldEnd + 100],
    [24, 0],
  );
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

  useEffect(() => {
    if (!activeMerchant) {
      return;
    }

    const audio = playbackAudioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
  }, [activeMerchant?.id]);

  useEffect(() => {
    const audio = playbackAudioRef.current;

    if (!audio) {
      return undefined;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [activeMerchant?.id]);

  async function handleTogglePlayback() {
    const audio = playbackAudioRef.current;

    if (!audio || !activeMerchant?.playbackAudioSrc) {
      setIsPlaying((current) => !current);
      return;
    }

    if (audio.paused) {
      if (audio.ended) {
        audio.currentTime = 0;
      }

      await audio.play();
      return;
    }

    audio.pause();
  }

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
      <div ref={shellTrackRef} className={styles.shellTrack}>
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
                <motion.div
                  className={styles.shellTextFrame}
                  style={
                    prefersReducedMotion
                      ? undefined
                      : {
                          opacity: firstFrameOpacity,
                          y: firstFrameY,
                          willChange: "opacity, transform",
                        }
                  }
                >
                  <p className={styles.shellIndex}>01</p>
                  <h3 className={styles.shellTitle}>
                    Reliability Is Paystack&apos;s Most Valuable Asset
                  </h3>
                </motion.div>

                {activeMerchant ? (
                  <motion.div
                    className={styles.shellDetailFrame}
                    style={
                      prefersReducedMotion
                        ? undefined
                        : {
                            opacity: secondFrameOpacity,
                            y: secondFrameY,
                            willChange: "opacity, transform",
                          }
                    }
                  >
                    <div className={styles.shellDetailCopy}>
                      <p className={styles.shellDetailKicker}>
                        {`${activeTheme?.indexLabel ?? "01"} ${activeTheme?.title ?? "Reliability Is Paystack's Most Valuable Asset"}`}
                      </p>
                      <div className={styles.shellMerchantSummary}>
                        <h3 className={styles.shellMerchantName}>{activeMerchant.name}</h3>
                        <p className={styles.shellMerchantBody}>
                          {activeMerchant.copy.map((segment, index) => {
                            if (typeof segment === "string") {
                              return (
                                <span key={`${activeMerchant.id}-copy-${index}`}>{segment}</span>
                              );
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

                      <div className={styles.shellMerchantFooter}>
                        <p className={styles.shellMerchantSupport}>
                          {activeTheme?.socialProofText ?? "We heard this from others too"}
                        </p>
                        <div className={styles.shellMerchantNavTheme}>
                          <MerchantNav
                            merchants={activeThemeMerchants}
                            activeIndex={safeActiveMerchantIndex}
                            onSelect={setActiveMerchantIndex}
                            className={styles.shellMerchantNav}
                            variant="dark"
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.shellDetailPlayer}>
                      <div
                        className={styles.shellPlayerStage}
                        style={{ "--shell-player-scale": shellPlayerScale.toFixed(3) }}
                      >
                        <PlayerStage
                          merchants={activeThemeMerchants}
                          activeIndex={safeActiveMerchantIndex}
                          activeMerchant={activeMerchant}
                          isPlaying={isPlaying}
                          onTogglePlayback={handleTogglePlayback}
                          spacing={orbitSpacing}
                          sideOffsetY={sideCassetteOffsetY}
                          textMorphDuration={textMorphDuration}
                          textMorphEase={textMorphEase}
                          playbackPulseDuration={playbackPulseDuration}
                          isPrimaryInstance={false}
                        />
                      </div>
                      <audio
                        key={activeMerchant.id}
                        ref={playbackAudioRef}
                        src={activeMerchant.playbackAudioSrc}
                        preload="metadata"
                        aria-hidden="true"
                      />
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ThemeShowcaseSection;
