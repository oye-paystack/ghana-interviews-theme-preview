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
  isActiveSlide = true,
  isPrimaryInstance = true,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isActiveSlide) {
      return undefined;
    }

    function handleMediaKey(event) {
      const mediaKeys = new Set(["MediaPlayPause", "MediaPlay", "MediaPause", "MediaStop"]);

      if (!mediaKeys.has(event.code) && !mediaKeys.has(event.key)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    }

    window.addEventListener("keydown", handleMediaKey, true);

    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      const noop = () => {};

      try {
        navigator.mediaSession.setActionHandler("play", noop);
        navigator.mediaSession.setActionHandler("pause", noop);
        navigator.mediaSession.setActionHandler("stop", noop);
      } catch {
        // Ignore browsers that do not support overriding these handlers.
      }

      return () => {
        window.removeEventListener("keydown", handleMediaKey, true);

        try {
          navigator.mediaSession.setActionHandler("play", null);
          navigator.mediaSession.setActionHandler("pause", null);
          navigator.mediaSession.setActionHandler("stop", null);
        } catch {
          // Ignore browsers that do not support clearing these handlers.
        }
      };
    }

    return () => {
      window.removeEventListener("keydown", handleMediaKey, true);
    };
  }, [isActiveSlide]);

  useEffect(() => {
    if (isActiveSlide) {
      return undefined;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);
  }, [isActiveSlide]);

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
    if (!isActiveSlide) {
      return;
    }

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
        <MerchantCopy
          merchant={activeMerchant}
          isPlaying={isPlaying}
          audioRef={audioRef}
          isPrimaryInstance={isPrimaryInstance}
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
          isPrimaryInstance={isPrimaryInstance}
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
