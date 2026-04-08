import LegacyMerchantCardsSection from "./LegacyMerchantCardsSection";
import styles from "./MerchantCardsSection.module.css";

function MerchantCardsSection({ hoverPreviewSize = 260, merchants }) {
  return (
    <section className={styles.section} aria-labelledby="merchant-cards-heading">
      <div className={styles.stage}>
        <div className={styles.headingBlock}>
          <p className={styles.eyebrow}>Who We Spoke To</p>
          <h2 className={styles.heading} id="merchant-cards-heading">
            Eight teams whose day-to-day realities shape the story that follows.
          </h2>
          <p className={styles.copy}>
            Hover over a merchant&apos;s card to see their 2025 wrapped.
          </p>
        </div>

        <LegacyMerchantCardsSection
          hoverPreviewSize={hoverPreviewSize}
          merchants={merchants}
        />
      </div>
    </section>
  );
}

export default MerchantCardsSection;
