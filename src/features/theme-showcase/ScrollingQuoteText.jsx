import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./ScrollingQuoteText.module.css";

const LINE_HEIGHTS = {
  shell: 29, // 20px * 1.45
  light: 36, // 24px * 1.5
};

const SCROLL_THRESHOLD_RATIO = 0.35;

function ScrollingQuoteText({
  segments,
  playbackTime,
  variant = "shell",
  merchantId,
  visibleLines = 9,
}) {
  const containerRef = useRef(null);
  const segmentRefs = useRef([]);
  const [segmentOffsets, setSegmentOffsets] = useState([]);
  const [contentHeight, setContentHeight] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const lineHeight = LINE_HEIGHTS[variant] ?? LINE_HEIGHTS.shell;
  const maxViewportHeight = visibleLines * lineHeight;

  const measureOffsets = () => {
    const offsets = segmentRefs.current.map((el) => el?.offsetTop ?? 0);
    setSegmentOffsets(offsets);
    if (containerRef.current) {
      setContentHeight(containerRef.current.scrollHeight);
    }
  };

  useLayoutEffect(() => {
    segmentRefs.current = segmentRefs.current.slice(0, segments?.length ?? 0);
    measureOffsets();
  }, [merchantId, segments]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const ro = new ResizeObserver(measureOffsets);
    ro.observe(container);
    return () => ro.disconnect();
  }, [merchantId]);

  // Disable transition briefly on merchant switch for instant reset
  useEffect(() => {
    setTransitionEnabled(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionEnabled(true));
    });
    return () => cancelAnimationFrame(id);
  }, [merchantId]);

  // Derive active segment index
  let activeIndex = 0;
  if (segments) {
    for (let i = 0; i < segments.length; i++) {
      if (playbackTime >= segments[i].start && playbackTime < segments[i].end) {
        activeIndex = i;
        break;
      }
      if (playbackTime >= segments[i].end) {
        activeIndex = i;
      }
    }
  }

  // Derive translateY — stop scrolling once the remaining content fits in the viewport
  const targetOffset = segmentOffsets[activeIndex] ?? 0;
  const scrollThreshold = maxViewportHeight * SCROLL_THRESHOLD_RATIO;
  const maxTranslate = contentHeight > maxViewportHeight ? -(contentHeight - maxViewportHeight) : 0;
  const rawTranslateY = targetOffset > scrollThreshold ? -(targetOffset - scrollThreshold) : 0;
  const translateY = Math.max(rawTranslateY, maxTranslate);
  const isScrolled = translateY < 0;

  // Shrink viewport so attribution stays tight against visible text bottom
  const remainingContent = contentHeight + translateY;
  const viewportHeight = contentHeight > 0
    ? Math.min(maxViewportHeight, Math.max(lineHeight, remainingContent))
    : maxViewportHeight;

  const isShell = variant === "shell";
  const textClass = isShell ? styles.shellText : styles.lightText;
  const segmentBase = isShell ? styles.shellSegment : styles.lightSegment;
  const segmentActive = isShell ? styles.shellSegmentActive : styles.lightSegmentActive;
  const segmentPlayed = isShell ? styles.shellSegmentPlayed : styles.lightSegmentPlayed;
  const segmentUpcoming = isShell ? styles.shellSegmentUpcoming : styles.lightSegmentUpcoming;

  if (!segments || segments.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.viewport}
      style={{ height: viewportHeight }}
      data-scrolled={isScrolled ? "true" : "false"}
    >
      <p
        ref={containerRef}
        className={`${styles.textBlock} ${textClass}`}
        style={{ transform: `translateY(${translateY}px)` }}
        data-transition={transitionEnabled ? "true" : "false"}
      >
        {segments.map((segment, index) => {
          const isActive = playbackTime >= segment.start && playbackTime < segment.end;
          const hasPlayed = playbackTime >= segment.end;

          return (
            <Fragment key={`${merchantId}-seg-${index}`}>
              <span
                ref={(el) => { segmentRefs.current[index] = el; }}
                className={`${segmentBase} ${
                  isActive
                    ? segmentActive
                    : hasPlayed
                      ? segmentPlayed
                      : segmentUpcoming
                }`}
              >
                {segment.text}
              </span>{" "}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
}

export default ScrollingQuoteText;
