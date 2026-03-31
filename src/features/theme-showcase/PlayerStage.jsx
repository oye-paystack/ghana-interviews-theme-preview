import { Play, Stop } from "@phosphor-icons/react";
import { TextMorph } from "torph/react";
import playerShellSrc from "../../../Player Translucent.svg";
import playerGrillSrc from "../../../Grill.png";
import CassetteOrbit from "./CassetteOrbit";
import styles from "./PlayerStage.module.css";

function PlayerStage({
  merchants,
  activeIndex,
  activeMerchant,
  isPlaying,
  onTogglePlayback,
  spacing,
  textMorphDuration,
  textMorphEase,
  playbackPulseDuration,
}) {
  const buttonLabel = isPlaying ? "Stop playback" : activeMerchant.listenLabel;

  return (
    <div className={styles.stage}>
      <CassetteOrbit
        merchants={merchants}
        activeIndex={activeIndex}
        spacing={spacing}
        isPlaying={isPlaying}
      />

      <div className={styles.playerBody}>
        <img className={styles.shell} src={playerShellSrc} alt="" aria-hidden="true" />
        <img className={styles.grill} src={playerGrillSrc} alt="" aria-hidden="true" />
        <div className={styles.window} aria-hidden="true" />
        <span
          className={`${styles.playbackIndicator} ${isPlaying ? styles.playbackIndicatorActive : ""}`}
          style={{ "--playback-pulse-duration": `${playbackPulseDuration}ms` }}
          data-playing={isPlaying ? "true" : "false"}
          data-pulse-duration={playbackPulseDuration}
          data-testid="playback-indicator"
          aria-hidden="true"
        />
        <span className={styles.playback}>PLAYBACK</span>

        <button
          className={styles.listenPill}
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
      </div>
    </div>
  );
}

export default PlayerStage;
