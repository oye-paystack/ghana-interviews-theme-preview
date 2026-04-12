import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { AnimateNumber } from "motion-plus/react";
import styles from "./InsightsSection.module.css";

const stats = [
  {
    label: "population",
    number: 35.7,
    format: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
    suffix: "M",
  },
  {
    label: "median age",
    number: 21.6,
    format: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
  },
  {
    label: "population in urban centres",
    number: 60,
    prefix: "~",
    suffix: "%",
  },
  {
    label: "mobile penetration (multiple SIMs per user)",
    number: 110,
    suffix: "%+",
  },
  {
    label: "internet penetration",
    number: 70,
    prefix: "~",
    suffix: "%",
  },
  {
    label: "adults using MoMo services",
    number: 80,
    suffix: "%+",
  },
  { label: "YoY increase in MoMo transactions", number: 57, suffix: "%" },
  // TODO: Revisit a richer ₵3T condensation choreography. This is intentionally
  // simplified to a direct 0 -> 3 count-up for now because the collapse reads poorly.
  {
    label: "MoMo 2024 transaction volume",
    number: 3,
    prefix: "₵",
    suffix: "T",
    format: { maximumFractionDigits: 0, useGrouping: false },
  },
];

function InsightStat({
  format,
  label,
  number,
  numberDuration,
  numberRollDuration,
  prefix,
  startNumber,
  suffix,
}) {
  const statRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: statRef,
    offset: ["start 0.98", "start 0.84"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (!hasTriggered && latest >= 0.2) {
        setHasTriggered(true);
      }
    });

    return unsubscribe;
  }, [hasTriggered, scrollYProgress]);

  return (
    <motion.div
      className={styles.stat}
      ref={statRef}
      style={{ opacity, y, willChange: "transform, opacity" }}
    >
      <p className={styles.statValue}>
        <AnimateNumber
          format={format}
          prefix={prefix}
          suffix={suffix}
          transition={{
            layout: { duration: numberDuration ?? 0.28 },
            opacity: { duration: 0.18, ease: "linear" },
            y: { type: "spring", visualDuration: numberRollDuration ?? 0.42, bounce: 0.16 },
          }}
        >
          {hasTriggered ? number : (startNumber ?? 0)}
        </AnimateNumber>
      </p>
      <p className={styles.statLabel}>{label}</p>
    </motion.div>
  );
}

function InsightsSection() {
  return (
    <section className={styles.section} id="insights" aria-labelledby="insights-heading">
      <div className={styles.stage}>
        <div className={styles.headingBlock}>
          <h2 className={styles.heading} id="insights-heading">
            Ghana, up close
          </h2>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statsIntro}>
            <p className={styles.subheading}>By the numbers</p>
          </div>
          {stats.map((stat) => (
            <InsightStat
              format={stat.format}
              key={stat.label}
              label={stat.label}
              number={stat.number}
              numberDuration={stat.numberDuration}
              numberRollDuration={stat.numberRollDuration}
              prefix={stat.prefix}
              startNumber={stat.startNumber}
              suffix={stat.suffix}
            />
          ))}
        </div>
        <div className={styles.marketCopy}>
          <p className={styles.subheading}>What the numbers don&apos;t show</p>
          <p className={styles.marketCopyParagraph}>
            This is a market where digital payments infrastructure is maturing rapidly, but
            merchant acquisition and retention remain{" "}
            <span className={styles.marketCopyHighlight}>deeply relationship-driven.</span>
          </p>
          <p className={styles.marketCopyParagraph}>
            Trust is earned through presence, consistency, and respect for local business norms,
            not through product features alone.
          </p>
          <p className={styles.marketCopyParagraph}>
            For Paystack, this means our go-to-market approach must invest in relationship depth
            alongside product quality: merchants who trust us stay, refer others, and expand their
            usage over time.
          </p>
          <p className={styles.marketCopyParagraph}>
            Those who don&apos;t trust us yet won&apos;t be convinced by better product UX.
          </p>
        </div>
        <p className={styles.marketNote}>
          If you&apos;re ever in Ghana, say please as often as you can. It signifies respect,
          especially to older people.
        </p>
      </div>
    </section>
  );
}

export default InsightsSection;
