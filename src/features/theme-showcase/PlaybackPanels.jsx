import { useEffect, useRef, useState } from "react";
import MerchantCopy from "./MerchantCopy";
import PlayerStage from "./PlayerStage";
import styles from "./ThemeShowcaseSection.module.css";

function PlaybackPanels({
  merchants,
  activeIndex,
  activeMerchant,
  orbitSpacing,
  sideCassetteOffsetY,
  textMorphDuration,
  textMorphEaseString,
  playbackPulseDuration,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);
  }, [activeMerchant.id]);

  useEffect(() => {
    const audio = audioRef.current;

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

  return (
    <>
      <section className={`${styles.panel} ${styles.copyPanel}`} aria-live="polite">
        <MerchantCopy merchant={activeMerchant} isPlaying={isPlaying} audioRef={audioRef} />
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
          preload="metadata"
          aria-hidden="true"
        />
      </section>
    </>
  );
}

export default PlaybackPanels;
