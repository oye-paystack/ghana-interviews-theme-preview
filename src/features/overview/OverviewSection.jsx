import UnicornScene from "unicornstudio-react";
import styles from "./OverviewSection.module.css";

const PROJECT_ID = "cBzWsZ2pKxXCWE8aQDdN";
const DEV_PROJECT_ID = import.meta.env.DEV
  ? `${PROJECT_ID}?update=${Date.now()}`
  : PROJECT_ID;

function OverviewSection({
  sceneOffsetX = 0,
  sceneOffsetY = 0,
  sceneScale = 1,
}) {
  const sceneFrameStyle = {
    "--overview-scene-offset-x": `${sceneOffsetX}px`,
    "--overview-scene-offset-y": `${sceneOffsetY}px`,
    "--overview-scene-scale": sceneScale,
  };

  return (
    <section className={styles.section} aria-labelledby="overview-heading">
      <div className={styles.inner}>
        <div className={styles.contentColumn}>
          <div className={styles.block}>
            <h1 className={styles.stats} id="overview-heading">
              <span className={styles.line}>
                <span className={styles.accent}>8</span> merchants.
              </span>
              <span className={styles.line}>
                <span className={styles.accent}>8</span> conversations.
              </span>
              <span className={styles.line}>
                <span className={styles.accent}>1</span> market.
              </span>
            </h1>

            <div className={styles.copy}>
              <p>
                We sat down with 8 merchants across Ghana and walked each of them
                through a personalized review of their 2025 on Paystack. Their
                transaction volume, success rates, busiest days, most-used payment
                channels. Then we shared what we&apos;re building in 2026 and asked what
                they thought.
              </p>
              <p>
                Each conversation was 30-45 minutes over Zoom. Every question was
                tailored to the merchant&apos;s actual business - what they sell, how they
                get paid, what they&apos;ve struggled with.
              </p>
            </div>
          </div>

          <div className={`${styles.block} ${styles.secondaryBlock}`}>
            <h2 className={styles.statement}>
              <span className={styles.accent}>Ghana</span> is growing fast.
            </h2>

            <div className={styles.copy}>
              <p>
                Ghana is one of our newest and fastest-growing markets. Merchants
                there are scaling quickly, building sophisticated products on top of
                our infrastructure, and running into gaps we haven&apos;t closed yet.
              </p>
              <p>
                We wanted to understand what&apos;s working, what&apos;s not, and merchant
                needs directly from the people running these businesses every day.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.sceneColumn} aria-hidden="true">
          <div className={styles.sceneFrame} style={sceneFrameStyle}>
            <UnicornScene
              projectId={DEV_PROJECT_ID}
              sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.6/dist/unicornStudio.umd.js"
              width="100%"
              height="100%"
              scale={1}
              dpi={2}
              fps={60}
              production={import.meta.env.PROD}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default OverviewSection;
