import { memo, useEffect, useRef } from "react";
import cassetteMarkup from "../../../Cassette.svg?raw";
import styles from "./CassetteArtwork.module.css";

const TARGET_REEL_SPEED = 240;
const START_SPEED_RESPONSE = 8;
const STOP_SPEED_RESPONSE = START_SPEED_RESPONSE / 1.4;
const STOP_THRESHOLD = 0.2;

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function prepareReel(group) {
  if (!group) {
    return;
  }

  group.style.transformBox = "fill-box";
  group.style.transformOrigin = "center";
  group.style.willChange = "transform";
}

function CassetteArtwork({ isSpinning = false }) {
  const artworkRef = useRef(null);
  const animationFrameRef = useRef(0);
  const angleRef = useRef(0);
  const speedRef = useRef(0);
  const targetSpeedRef = useRef(isSpinning ? TARGET_REEL_SPEED : 0);

  useEffect(() => {
    const artwork = artworkRef.current;
    if (!artwork) {
      return undefined;
    }

    const leftReelGroup = artwork.querySelector("#left-reel-group");
    const rightReelGroup = artwork.querySelector("#right-reel-group");

    prepareReel(leftReelGroup);
    prepareReel(rightReelGroup);

    const applyRotation = () => {
      const rotation = `rotate(${angleRef.current}deg)`;

      if (leftReelGroup) {
        leftReelGroup.style.transform = rotation;
      }

      if (rightReelGroup) {
        rightReelGroup.style.transform = rotation;
      }
    };

    const stopAnimation = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
      }
    };

    if (prefersReducedMotion()) {
      stopAnimation();
      speedRef.current = 0;
      applyRotation();

      return stopAnimation;
    }

    targetSpeedRef.current = isSpinning ? TARGET_REEL_SPEED : 0;

    const animate = (timestamp) => {
      const lastTimestamp = animate.lastTimestamp ?? timestamp;
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      animate.lastTimestamp = timestamp;

      const response =
        targetSpeedRef.current > speedRef.current ? START_SPEED_RESPONSE : STOP_SPEED_RESPONSE;
      const smoothing = Math.min(1, deltaSeconds * response);
      speedRef.current += (targetSpeedRef.current - speedRef.current) * smoothing;
      angleRef.current = (angleRef.current + speedRef.current * deltaSeconds) % 360;
      applyRotation();

      if (targetSpeedRef.current > 0 || Math.abs(speedRef.current) > STOP_THRESHOLD) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      speedRef.current = 0;
      animate.lastTimestamp = undefined;
      animationFrameRef.current = 0;
    };

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return stopAnimation;
  }, [isSpinning]);

  return (
    <div
      ref={artworkRef}
      className={styles.artwork}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: cassetteMarkup }}
    />
  );
}

export default memo(CassetteArtwork);
