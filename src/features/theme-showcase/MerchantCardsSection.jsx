import LegacyMerchantCardsSection from "./LegacyMerchantCardsSection";
import styles from "./MerchantCardsSection.module.css";

function MerchantCardsSection({ merchants }) {
  return (
    <section className={styles.section} aria-labelledby="merchant-cards-heading">
      <div className={styles.stage}>
        <div className={styles.headingBlock}>
          <p className={styles.eyebrow}>Who We Spoke To</p>
          <h2 className={styles.heading} id="merchant-cards-heading">
            Eight teams whose day-to-day realities shape the story that follows.
          </h2>
          <p className={styles.copy}>
            Each card maps to a merchant interview from the Ghana research trip, using the
            visual system from Figma before the deeper theme-by-theme breakdown begins.
          </p>
        </div>

        <LegacyMerchantCardsSection merchants={merchants} />
      </div>
    </section>
  );
}

export default MerchantCardsSection;
