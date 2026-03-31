import { Play } from "@phosphor-icons/react";
import { TextMorph } from "torph/react";
import playerShellSrc from "../../../Player Translucent.svg";
import playerGrillSrc from "../../../Grill.png";
import CassetteOrbit from "./CassetteOrbit";
import styles from "./PlayerStage.module.css";

function PlayerStage({
  merchants,
  activeIndex,
  activeMerchant,
  spacing,
  textMorphDuration,
  textMorphEase,
}) {
  return (
    <div className={styles.stage}>
      <CassetteOrbit merchants={merchants} activeIndex={activeIndex} spacing={spacing} />

      <div className={styles.playerBody}>
        <img className={styles.shell} src={playerShellSrc} alt="" aria-hidden="true" />
        <img className={styles.grill} src={playerGrillSrc} alt="" aria-hidden="true" />
        <div className={styles.window} aria-hidden="true" />
        <span className={styles.playback}>PLAYBACK</span>

        <button
          className={styles.listenPill}
          type="button"
          data-text-morph-duration={textMorphDuration}
          data-text-morph-ease={textMorphEase}
        >
          <span className={styles.listenPillIcon} aria-hidden="true">
            <Play className={styles.listenPillGlyph} weight="fill" />
          </span>
          <TextMorph
            as="span"
            className={styles.listenPillLabel}
            duration={textMorphDuration}
            ease={textMorphEase}
          >
            {activeMerchant.listenLabel}
          </TextMorph>
        </button>
      </div>
    </div>
  );
}

export default PlayerStage;
