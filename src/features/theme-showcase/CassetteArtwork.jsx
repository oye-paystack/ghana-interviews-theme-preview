import { memo, useEffect, useId, useMemo, useRef } from "react";
import cassetteSrc from "../../../Cassette.svg";
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

function prefixSvgIds(svgMarkup, prefix) {
  const ids = [...svgMarkup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);

  if (ids.length === 0) {
    return svgMarkup;
  }

  let nextMarkup = svgMarkup;

  for (const id of ids) {
    const nextId = `${prefix}-${id}`;
    nextMarkup = nextMarkup.replaceAll(`id="${id}"`, `id="${nextId}"`);
    nextMarkup = nextMarkup.replaceAll(`url(#${id})`, `url(#${nextId})`);
    nextMarkup = nextMarkup.replaceAll(`href="#${id}"`, `href="#${nextId}"`);
    nextMarkup = nextMarkup.replaceAll(`xlink:href="#${id}"`, `xlink:href="#${nextId}"`);
    nextMarkup = nextMarkup.replaceAll(`="#${id}"`, `="#${nextId}"`);
  }

  return nextMarkup;
}

function CassetteArtwork({
  isInline = true,
  isSpinning = false,
}) {
  const svgInstanceId = useId().replace(/:/g, "");
  const reelGroupPrefix = useMemo(() => `cassette-${svgInstanceId}`, [svgInstanceId]);
  const prefixedCassetteMarkup = useMemo(
    () => prefixSvgIds(cassetteMarkup, reelGroupPrefix),
    [reelGroupPrefix],
  );
  const artworkRef = useRef(null);
  const animationFrameRef = useRef(0);
  const angleRef = useRef(0);
  const speedRef = useRef(0);
  const targetSpeedRef = useRef(isSpinning ? TARGET_REEL_SPEED : 0);

  useEffect(() => {
    if (!isInline) {
      return undefined;
    }

    const artwork = artworkRef.current;
    if (!artwork) {
      return undefined;
    }

    const leftReelGroup = artwork.querySelector(`#${reelGroupPrefix}-left-reel-group`);
    const rightReelGroup = artwork.querySelector(`#${reelGroupPrefix}-right-reel-group`);

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
  }, [isInline, isSpinning, reelGroupPrefix]);

  if (!isInline) {
    return <img className={styles.artworkImage} src={cassetteSrc} alt="" aria-hidden="true" />;
  }

  return (
    <div
      ref={artworkRef}
      className={styles.artwork}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: prefixedCassetteMarkup }}
    />
  );
}

export default memo(CassetteArtwork);
