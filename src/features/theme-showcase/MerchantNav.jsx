import {
  AirplaneTilt,
  CaretLeft,
  CaretRight,
  PiggyBank,
  Plant,
} from "@phosphor-icons/react";
import styles from "./MerchantNav.module.css";

const iconMap = {
  airplaneTilt: AirplaneTilt,
  plant: Plant,
  piggyBank: PiggyBank,
};

function MerchantNav({
  merchants,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  atStart,
  atEnd,
}) {
  return (
    <nav className={styles.nav} aria-label="Merchant carousel">
      <button
        className={styles.arrowButton}
        type="button"
        aria-label="Previous merchant"
        disabled={atStart}
        onClick={onPrev}
      >
        <CaretLeft className={styles.arrowGlyph} />
      </button>

      {merchants.map((merchant, index) => {
        const Icon = iconMap[merchant.iconKey];
        const isActive = index === activeIndex;

        return (
          <button
            className={`${styles.iconButton} ${isActive ? styles.iconButtonActive : ""}`}
            type="button"
            aria-label={merchant.name}
            aria-pressed={isActive}
            data-active={isActive}
            key={merchant.id}
            onClick={() => onSelect(index)}
          >
            <Icon className={styles.iconGlyph} weight="duotone" />
          </button>
        );
      })}

      <button
        className={styles.arrowButton}
        type="button"
        aria-label="Next merchant"
        disabled={atEnd}
        onClick={onNext}
      >
        <CaretRight className={styles.arrowGlyph} />
      </button>
    </nav>
  );
}

export default MerchantNav;
