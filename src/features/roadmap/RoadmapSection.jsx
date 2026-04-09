import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TextMorph } from "torph/react";
import {
  defaultExpandedRoadmapItemId,
  roadmapItems,
} from "../../data/roadmap";
import styles from "./RoadmapSection.module.css";

const COLLAPSED_CELL_WIDTH = 120;
const EXPANDED_CELL_WIDTH = 153.25;
const BAR_GAP = 4;
const BAR_PADDING = 8;
const INLINE_BAR_LEFT_PADDING = 12;
const INLINE_BAR_RIGHT_PADDING = 4;
const INLINE_LABEL_GAP = 24;
const COLLAPSED_BAR_HEIGHT = 41;
const EXPANDED_BAR_HEIGHT = 164;
const COLLAPSED_CELL_HEIGHT = 33;
const EXPANDED_CELL_HEIGHT = 156;
const BAR_TRANSITION = {
  type: "spring",
  bounce: 0.08,
  visualDuration: 0.42,
};
const DETAIL_ENTRANCE_DELAY = BAR_TRANSITION.visualDuration;
const COLLAPSED_CELL_INNER_WIDTH = COLLAPSED_CELL_WIDTH - 24;
const OUTSIDE_LABEL_COLUMN_WIDTH = 154;
const OUTSIDE_LABEL_GAP = 20;
const CHART_GAP = 28;
const MERCHANT_COUNT_GAP = 12;
const TOTAL_MERCHANTS = new Set(
  roadmapItems.flatMap((item) => item.merchants.map((m) => m.shortLabel)),
).size;

function getInlineLabelWidth(label) {
  if (typeof document === "undefined") {
    return 0;
  }

  const canvas = getInlineLabelWidth.canvas ?? document.createElement("canvas");
  const context = canvas.getContext("2d");

  getInlineLabelWidth.canvas = canvas;

  if (!context) {
    return 0;
  }

  context.font = '600 14px "PP Mori Semibold", sans-serif';
  return Math.ceil(context.measureText(label).width);
}

function getSharedInlineLabelWidth() {
  return roadmapItems.reduce(
    (maxWidth, item) => Math.max(maxWidth, getInlineLabelWidth(item.label)),
    0,
  );
}

function getChartReferenceWidth(showInlineLabels) {
  const sharedInlineLabelWidth = showInlineLabels ? getSharedInlineLabelWidth() : 0;
  const widestBarWidth = roadmapItems.reduce(
    (maxWidth, item) =>
      Math.max(
        maxWidth,
        getBarWidth(item.merchants.length, true, showInlineLabels, sharedInlineLabelWidth),
      ),
    0,
  );

  if (showInlineLabels) {
    return widestBarWidth;
  }

  return OUTSIDE_LABEL_COLUMN_WIDTH + OUTSIDE_LABEL_GAP + widestBarWidth;
}

function getBarWidth(cellCount, isExpanded, includeInlineLabel = false, inlineLabelWidth = 0) {
  const cellWidth = isExpanded ? EXPANDED_CELL_WIDTH : COLLAPSED_CELL_WIDTH;
  const merchantContentWidth =
    (cellWidth * cellCount) + (Math.max(cellCount - 1, 0) * BAR_GAP);

  if (!includeInlineLabel) {
    return merchantContentWidth + BAR_PADDING;
  }

  return (
    merchantContentWidth
    + inlineLabelWidth
    + INLINE_BAR_LEFT_PADDING
    + INLINE_BAR_RIGHT_PADDING
    + INLINE_LABEL_GAP
  );
}

function RoadmapCellLabel({ detailText, isExpanded, showMotion, shortText }) {
  const labelRef = useRef(null);
  const shortMeasureRef = useRef(null);
  const [shortLabelWidth, setShortLabelWidth] = useState(0);
  const text = isExpanded ? detailText : shortText;
  const shouldMorphText = shortText !== detailText;

  useLayoutEffect(() => {
    if (!shortMeasureRef.current) {
      return;
    }

    const nextWidth = shortMeasureRef.current.getBoundingClientRect().width;
    setShortLabelWidth(nextWidth);
  }, [shortText]);

  const collapsedOffset = Math.max((COLLAPSED_CELL_INNER_WIDTH - shortLabelWidth) / 2, 0);

  return (
    <>
      <span ref={shortMeasureRef} className={styles.cellLabelMeasure} aria-hidden="true">
        {shortText}
      </span>
      <motion.span
        ref={labelRef}
        className={`${styles.cellLabel} ${
          isExpanded ? styles.cellLabelExpanded : styles.cellLabelCollapsed
        }`}
        style={showMotion ? { alignSelf: "flex-start" } : undefined}
        animate={showMotion ? { x: isExpanded ? 0 : collapsedOffset } : { x: 0 }}
        transition={showMotion ? BAR_TRANSITION : { duration: 0 }}
      >
        {shouldMorphText ? (
          <TextMorph
            as="span"
            className={styles.cellLabelText}
            duration={360}
            ease={{ stiffness: 180, damping: 22, mass: 0.9 }}
          >
            {text}
          </TextMorph>
        ) : (
          text
        )}
      </motion.span>
    </>
  );
}

function RoadmapBar({
  item,
  isExpanded,
  isHighlighted,
  onToggle,
  showInlineLabels,
  showLabelMotion,
}) {
  const inlineLabelWidth = showInlineLabels ? getSharedInlineLabelWidth() : 0;
  const targetWidth = getBarWidth(
    item.merchants.length,
    isExpanded,
    showInlineLabels,
    inlineLabelWidth,
  );

  return (
    <div
      className={`${styles.row} ${showInlineLabels ? styles.rowInlineLabel : ""}`}
      data-expanded={isExpanded ? "true" : "false"}
    >
      {showInlineLabels ? <p className={styles.visuallyHidden}>{item.label}</p> : (
        <p className={styles.label}>
          {item.label}
        </p>
      )}

      <div className={styles.barGroup}>
        <motion.button
          type="button"
          className={`${styles.bar} ${isHighlighted ? styles.barHighlighted : ""}`}
          aria-expanded={isExpanded}
          style={{
            willChange: "width, height",
            ...(showInlineLabels ? { "--inline-label-width": `${inlineLabelWidth}px` } : {}),
          }}
          animate={{
            width: targetWidth,
            height: isExpanded ? EXPANDED_BAR_HEIGHT : COLLAPSED_BAR_HEIGHT,
          }}
          transition={BAR_TRANSITION}
          onClick={() => onToggle(item.id)}
        >
          {showInlineLabels ? (
            <span className={styles.barLabelText}>
              {item.label}
            </span>
          ) : null}
          <span className={styles.cellGroup}>
            {item.merchants.map((merchant) => (
              <motion.span
                className={styles.cell}
                key={`${item.id}-${merchant.detailLabel}`}
                initial={false}
                animate={{
                  width: isExpanded ? EXPANDED_CELL_WIDTH : COLLAPSED_CELL_WIDTH,
                  height: isExpanded ? EXPANDED_CELL_HEIGHT : COLLAPSED_CELL_HEIGHT,
                }}
                transition={BAR_TRANSITION}
              >
                <RoadmapCellLabel
                  detailText={merchant.detailLabel}
                  isExpanded={isExpanded}
                  showMotion={showLabelMotion}
                  shortText={merchant.shortLabel}
                />
                <AnimatePresence initial={false}>
                  {isExpanded ? (
                    <motion.span
                      key={`${item.id}-${merchant.detailLabel}-detail`}
                      className={styles.cellDetail}
                      initial={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{
                        opacity: 0,
                        y: -6,
                        filter: "blur(2px)",
                        transition: { duration: 0.1, ease: "easeOut" },
                      }}
                      transition={{
                        duration: 0.18,
                        delay: DETAIL_ENTRANCE_DELAY,
                        ease: "easeOut",
                      }}
                    >
                      {merchant.detail}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.span>
            ))}
          </span>
        </motion.button>
        <AnimatePresence initial={false}>
          {!isExpanded ? (
            <motion.span
              key="count"
              className={styles.merchantCount}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {item.merchants.length} of {TOTAL_MERCHANTS}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getChartMinHeight() {
  const count = roadmapItems.length;
  const gaps = Math.max(count - 1, 0) * CHART_GAP;
  return EXPANDED_BAR_HEIGHT + (count - 1) * COLLAPSED_BAR_HEIGHT + gaps;
}

function RoadmapSection({ showInlineLabels = false, showLabelMotion = true }) {
  const [expandedItemId, setExpandedItemId] = useState(defaultExpandedRoadmapItemId);
  const chartRef = useRef(null);
  const hasAutoExpandedRef = useRef(false);
  const autoExpandTimerRef = useRef(null);
  const chartReferenceWidth = getChartReferenceWidth(showInlineLabels);
  const chartMinHeight = getChartMinHeight();

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoExpandedRef.current) {
          autoExpandTimerRef.current = setTimeout(() => {
            hasAutoExpandedRef.current = true;
            setExpandedItemId(roadmapItems[0].id);
          }, 2000);
        } else if (!entry.isIntersecting && autoExpandTimerRef.current) {
          clearTimeout(autoExpandTimerRef.current);
          autoExpandTimerRef.current = null;
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(chart);

    return () => {
      observer.disconnect();
      if (autoExpandTimerRef.current) {
        clearTimeout(autoExpandTimerRef.current);
      }
    };
  }, []);

  const longestItemId = roadmapItems.reduce((longest, item) =>
    item.merchants.length > longest.merchants.length ? item : longest,
  ).id;

  function handleToggle(itemId) {
    if (autoExpandTimerRef.current) {
      clearTimeout(autoExpandTimerRef.current);
      autoExpandTimerRef.current = null;
    }
    hasAutoExpandedRef.current = true;
    setExpandedItemId((currentId) => (currentId === itemId ? null : itemId));
  }

  return (
    <section className={styles.section} id="roadmap" aria-labelledby="whats-next">
      <div className={styles.stage}>
        <div className={styles.headingBlock}>
          <p className={styles.eyebrow}>Roadmap</p>
          <h2 className={styles.heading} id="whats-next">
            Where merchant demand is pulling the roadmap next.
          </h2>
          <p className={styles.copy}>
            Click any bar to see who's behind the demand.
          </p>
        </div>

        <div
          ref={chartRef}
          className={styles.chart}
          style={{ "--chart-reference-width": `${chartReferenceWidth}px`, minHeight: chartMinHeight }}
        >
          {roadmapItems.map((item) => (
            <RoadmapBar
              item={item}
              isExpanded={expandedItemId === item.id}
              isHighlighted={item.id === longestItemId}
              key={item.id}
              onToggle={handleToggle}
              showInlineLabels={showInlineLabels}
              showLabelMotion={showLabelMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoadmapSection;
