import { Fragment } from "react";
import quoteMarksSrc from "../../../.figma-assets/64f7ba277478aec54c94539da41331f3f5c5d51d.svg";
import styles from "./MerchantCopy.module.css";

function MerchantCopy({ merchant, isPlaying }) {
  return (
    <div
      className={styles.copy}
      data-playing={isPlaying ? "true" : "false"}
      data-testid="merchant-copy"
    >
      <div
        className={`${styles.layer} ${styles.summaryLayer} ${isPlaying ? styles.summaryLayerHidden : styles.layerVisible}`}
      >
        <h2 className={styles.title}>{merchant.name}</h2>
        <p className={styles.body}>
          {merchant.copy.map((segment, index) => {
            if (typeof segment === "string") {
              return <Fragment key={`${merchant.id}-segment-${index}`}>{segment}</Fragment>;
            }

            return (
              <span className={styles.highlight} key={`${merchant.id}-segment-${index}`}>
                {segment.highlight}
              </span>
            );
          })}
        </p>
      </div>

      <div
        className={`${styles.layer} ${styles.quoteLayer} ${isPlaying ? styles.quoteLayerVisible : styles.quoteLayerHidden}`}
        aria-hidden={!isPlaying}
      >
        <img className={styles.quoteMark} src={quoteMarksSrc} alt="" aria-hidden="true" />

        <div className={styles.quoteContent}>
          <p className={styles.quoteText}>
            <span className={styles.quoteLead}>{merchant.playbackQuote.lead}</span>
            <span className={styles.quoteRest}>{merchant.playbackQuote.rest}</span>
          </p>

          <div className={styles.quoteAttribution}>
            <p className={styles.quoteSpeaker}>{merchant.playbackQuote.speakerName}</p>
            <p className={styles.quoteRole}>{merchant.playbackQuote.speakerRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MerchantCopy;
