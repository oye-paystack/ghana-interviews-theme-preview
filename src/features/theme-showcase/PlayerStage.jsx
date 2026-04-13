import { Play, Stop } from "@phosphor-icons/react";
import { TextMorph } from "torph/react";
import playerShellSrc from "../../../Player Translucent.svg";
import playerGrillSrc from "../../../Grill.png";
import CassetteOrbit from "./CassetteOrbit";
import styles from "./PlayerStage.module.css";

function PlaybackButton({
  isPlaying,
  buttonLabel,
  textMorphDuration,
  textMorphEase,
  onTogglePlayback,
  className = "",
}) {
  const buttonClassName = className
    ? `${styles.listenPill} ${className}`
    : styles.listenPill;

  return (
    <button
      className={buttonClassName}
      type="button"
      aria-pressed={isPlaying}
      data-text-morph-duration={textMorphDuration}
      data-text-morph-ease={textMorphEase}
      onClick={onTogglePlayback}
    >
      <span className={styles.listenPillIcon} aria-hidden="true">
        {isPlaying ? (
          <Stop className={styles.listenPillGlyph} weight="fill" />
        ) : (
          <Play className={styles.listenPillGlyph} weight="fill" />
        )}
      </span>
      <TextMorph
        as="span"
        className={styles.listenPillLabel}
        duration={textMorphDuration}
        ease={textMorphEase}
      >
        {buttonLabel}
      </TextMorph>
    </button>
  );
}

function PlayerStage({
  merchants,
  activeIndex,
  activeMerchant,
  isPlaying,
  onTogglePlayback,
  spacing,
  sideOffsetY,
  textMorphDuration,
  textMorphEase,
  playbackPulseDuration,
  isActiveSlide = true,
  isPrimaryInstance = true,
  showPlaybackButton = true,
  panelColor,
}) {
  const buttonLabel = isPlaying ? "Stop playback" : activeMerchant.listenLabel;

  return (
    <div className={styles.stage}>
      <CassetteOrbit
        merchants={merchants}
        activeIndex={activeIndex}
        spacing={spacing}
        sideOffsetY={sideOffsetY}
        isPlaying={isPlaying}
        panelColor={panelColor}
      />

      <div className={styles.playerBody}>
        <img
          className={styles.shell}
          src={playerShellSrc}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
        <img
          className={styles.grill}
          src={playerGrillSrc}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
        <div className={styles.window} aria-hidden="true" />
        <span
          className={`${styles.playbackIndicator} ${isPlaying ? styles.playbackIndicatorActive : ""}`}
          style={{ "--playback-pulse-duration": `${playbackPulseDuration}ms` }}
          data-playing={isPlaying ? "true" : "false"}
          data-pulse-duration={playbackPulseDuration}
          data-testid={isPrimaryInstance ? "playback-indicator" : undefined}
          aria-hidden="true"
        />
        <span className={styles.playback}>PLAYBACK</span>

        {showPlaybackButton ? (
          <PlaybackButton
            isPlaying={isPlaying}
            buttonLabel={buttonLabel}
            textMorphDuration={textMorphDuration}
            textMorphEase={textMorphEase}
            onTogglePlayback={onTogglePlayback}
            className={styles.listenPillDocked}
          />
        ) : null}
      </div>
    </div>
  );
}

export { PlaybackButton };
export default PlayerStage;
