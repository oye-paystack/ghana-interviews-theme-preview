import LegacyMerchantCardsSection from "./LegacyMerchantCardsSection";
import styles from "./MerchantCardsSection.module.css";

function MerchantCardsSection({ hoverPreviewSize = 260, merchants }) {
  return (
    <section className={styles.section} aria-labelledby="merchant-cards-heading">
      <div className={styles.stage}>
        <div className={styles.headingBlock}>
          <p className={styles.eyebrow}>Who We Spoke To</p>
          <h2 className={styles.heading} id="merchant-cards-heading">
            Meet the merchants
          </h2>
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

        <LegacyMerchantCardsSection
          hoverPreviewSize={hoverPreviewSize}
          merchants={merchants}
        />
      </div>
    </section>
  );
}

export default MerchantCardsSection;
