import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  defaultExpandedRoadmapItemId,
  roadmapItems,
} from "../../data/roadmap";
import styles from "./RoadmapSection.module.css";

const COLLAPSED_CELL_WIDTH = 120;
const EXPANDED_CELL_WIDTH = 153.25;
const BAR_GAP = 4;
const BAR_PADDING = 8;
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

function getBarWidth(cellCount, isExpanded) {
  const cellWidth = isExpanded ? EXPANDED_CELL_WIDTH : COLLAPSED_CELL_WIDTH;
  return (cellWidth * cellCount) + (Math.max(cellCount - 1, 0) * BAR_GAP) + BAR_PADDING;
}

function RoadmapCellLabel({ isExpanded, showMotion, text }) {
  const labelRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useLayoutEffect(() => {
    if (!labelRef.current) {
      return;
    }

    const nextWidth = labelRef.current.getBoundingClientRect().width;
    setLabelWidth(nextWidth);
  }, [text]);

  const collapsedOffset = Math.max((COLLAPSED_CELL_INNER_WIDTH - labelWidth) / 2, 0);

  return (
    <motion.span
      ref={labelRef}
      className={`${styles.cellLabel} ${
        isExpanded ? styles.cellLabelExpanded : styles.cellLabelCollapsed
      }`}
      style={showMotion ? { alignSelf: "flex-start" } : undefined}
      animate={showMotion ? { x: isExpanded ? 0 : collapsedOffset } : { x: 0 }}
      transition={showMotion ? BAR_TRANSITION : { duration: 0 }}
    >
      {text}
    </motion.span>
  );
}

function RoadmapBar({ item, isExpanded, onToggle, showLabelMotion }) {
  const targetWidth = getBarWidth(item.merchants.length, isExpanded);

  return (
    <motion.div
      initial={false}
      layout="position"
      className={styles.row}
      data-expanded={isExpanded ? "true" : "false"}
    >
      <p className={styles.label}>
        {item.label}
      </p>

      <motion.button
        type="button"
        className={`${styles.bar} ${isExpanded ? styles.barExpanded : styles.barCollapsed}`}
        aria-expanded={isExpanded}
        style={{ willChange: "width, height" }}
        animate={{
          width: targetWidth,
          height: isExpanded ? EXPANDED_BAR_HEIGHT : COLLAPSED_BAR_HEIGHT,
        }}
        transition={BAR_TRANSITION}
        onClick={() => onToggle(item.id)}
      >
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
              isExpanded={isExpanded}
              showMotion={showLabelMotion}
              text={isExpanded ? merchant.detailLabel : merchant.shortLabel}
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
      </motion.button>
    </motion.div>
  );
}

function RoadmapSection({ showLabelMotion = true }) {
  const [expandedItemId, setExpandedItemId] = useState(defaultExpandedRoadmapItemId);

  function handleToggle(itemId) {
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
            Each bar groups the merchants asking for a feature. Select one to expand the
            demand behind it.
          </p>
        </div>

        <MotionConfig
          transition={{
            layout: {
              type: "spring",
              bounce: 0,
              visualDuration: 0.34,
            },
          }}
        >
          <div className={styles.chart}>
            {roadmapItems.map((item) => (
              <RoadmapBar
                item={item}
                isExpanded={expandedItemId === item.id}
                key={item.id}
                onToggle={handleToggle}
                showLabelMotion={showLabelMotion}
              />
            ))}
          </div>
        </MotionConfig>
      </div>
    </section>
  );
}

export default RoadmapSection;
