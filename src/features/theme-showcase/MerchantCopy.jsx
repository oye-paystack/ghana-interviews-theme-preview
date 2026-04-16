import { Fragment, useEffect, useState } from "react";
import quoteMarksSrc from "../../../Quotes.svg";
import styles from "./MerchantCopy.module.css";
import ScrollingQuoteText from "./ScrollingQuoteText";

function MerchantCopy({ merchant, isPlaying, audioRef = null, isPrimaryInstance = true }) {
  const [playbackTime, setPlaybackTime] = useState(0);
  const quoteSegments = merchant.playbackQuote.segments ?? null;

  useEffect(() => {
    setPlaybackTime(0);
  }, [merchant.id]);

  useEffect(() => {
    if (!quoteSegments || !audioRef?.current) {
      return undefined;
    }

    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      setPlaybackTime(audio.currentTime);
    };
    const handleEnded = () => {
      setPlaybackTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioRef, merchant.id, quoteSegments]);

  return (
    <div
      className={styles.copy}
      data-playing={isPlaying ? "true" : "false"}
      data-testid={isPrimaryInstance ? "merchant-copy" : undefined}
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
        <img
          className={styles.quoteMark}
          src={quoteMarksSrc}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />

        <div className={styles.quoteContent}>
          {quoteSegments ? (
            <ScrollingQuoteText
              segments={quoteSegments}
              playbackTime={playbackTime}
              variant="light"
              merchantId={merchant.id}
            />
          ) : (
            <p className={styles.quoteText}>
              <span className={styles.quoteLead}>{merchant.playbackQuote.lead}</span>
              <span className={styles.quoteRest}>{merchant.playbackQuote.rest}</span>
            </p>
          )}

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
