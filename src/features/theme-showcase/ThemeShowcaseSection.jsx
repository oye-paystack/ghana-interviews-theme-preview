import { useEffect, useRef, useState } from "react";
import ConfigPopover from "./ConfigPopover";
import MerchantCopy from "./MerchantCopy";
import MerchantNav from "./MerchantNav";
import PlayerStage from "./PlayerStage";
import styles from "./ThemeShowcaseSection.module.css";

const DEFAULT_ORBIT_SPACING = 360;
const DEFAULT_SIDE_CASSETTE_OFFSET_Y = -12;
const DEFAULT_TEXT_MORPH_DURATION = 400;
const DEFAULT_TEXT_MORPH_EASE = [0.19, 1, 0.22, 1];
const DEFAULT_PLAYBACK_PULSE_DURATION = 3200;

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
  const [sideCassetteOffsetY, setSideCassetteOffsetY] = useState(
    DEFAULT_SIDE_CASSETTE_OFFSET_Y,
  );
  const [textMorphDuration, setTextMorphDuration] = useState(DEFAULT_TEXT_MORPH_DURATION);
  const [textMorphEase, setTextMorphEase] = useState(DEFAULT_TEXT_MORPH_EASE);
  const [playbackPulseDuration, setPlaybackPulseDuration] = useState(
    DEFAULT_PLAYBACK_PULSE_DURATION,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const audioRef = useRef(null);

  const activeMerchant = merchants[activeIndex];
  const sectionHeadingId = `${theme.id}-heading`;
  const textMorphEaseString = `cubic-bezier(${textMorphEase.join(", ")})`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaybackTime(0);
    setIsPlaying(false);
  }, [activeMerchant.id]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return undefined;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
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
  }, [activeMerchant.id]);

  async function handleTogglePlayback() {
    const audio = audioRef.current;

    if (activeMerchant.playbackAudioSrc && audio) {
      if (audio.paused) {
        if (audio.ended) {
          audio.currentTime = 0;
        }

        await audio.play();
      } else {
        audio.pause();
      }

      return;
    }

    setIsPlaying((playing) => !playing);
  }

  const sectionStyle = {
    "--orbit-spacing": `${orbitSpacing}px`,
  };

  return (
    <section
      className={styles.section}
      style={sectionStyle}
      aria-labelledby={sectionHeadingId}
      data-testid="theme-showcase-section"
      data-show-grid={showGridOverlay ? "true" : "false"}
    >
      <div className={styles.gridOverlay} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span className={styles.gridOverlayColumn} key={`grid-column-${index}`} />
        ))}
      </div>

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
            <MerchantCopy
              merchant={activeMerchant}
              isPlaying={isPlaying}
              playbackTime={playbackTime}
            />
          </section>

          <section className={`${styles.panel} ${styles.playerPanel}`} aria-label="Cassette player">
            <PlayerStage
              merchants={merchants}
              activeIndex={activeIndex}
              activeMerchant={activeMerchant}
              isPlaying={isPlaying}
              onTogglePlayback={handleTogglePlayback}
              spacing={orbitSpacing}
              sideOffsetY={sideCassetteOffsetY}
              textMorphDuration={textMorphDuration}
              textMorphEase={textMorphEaseString}
              playbackPulseDuration={playbackPulseDuration}
            />
            <audio
              key={activeMerchant.id}
              ref={audioRef}
              src={activeMerchant.playbackAudioSrc}
              preload="auto"
              aria-hidden="true"
            />
          </section>
        </div>
      </div>

      <p className={styles.socialProofText}>{theme.socialProofText}</p>

      <div className={styles.navSlot}>
        <MerchantNav
          merchants={merchants}
          activeIndex={activeIndex}
          onSelect={(index) => setActiveIndex(index)}
        />
      </div>

      {showDebugControls ? (
        <ConfigPopover
          spacing={orbitSpacing}
          sideCassetteOffsetY={sideCassetteOffsetY}
          textMorphDuration={textMorphDuration}
          textMorphEase={textMorphEase}
          textMorphEaseString={textMorphEaseString}
          playbackPulseDuration={playbackPulseDuration}
          showGridOverlay={showGridOverlay}
          isOpen={isConfigOpen}
          onToggle={() => setIsConfigOpen((open) => !open)}
          onSpacingChange={(value) => setOrbitSpacing(value)}
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
