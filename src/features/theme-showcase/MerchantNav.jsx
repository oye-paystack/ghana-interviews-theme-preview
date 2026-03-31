import { AirplaneTilt, PiggyBank, Plant } from "@phosphor-icons/react";
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
}) {
  return (
    <nav className={styles.nav} aria-label="Merchant carousel">
      {merchants.map((merchant, index) => {
        const Icon = iconMap[merchant.iconKey];
        const isActive = index === activeIndex;

        return (
          <button
            className={`${styles.segment} ${isActive ? styles.segmentActive : ""}`}
            type="button"
            aria-label={merchant.name}
            aria-pressed={isActive}
            data-active={isActive}
            key={merchant.id}
            onClick={() => onSelect(index)}
          >
            <span className={styles.iconSlot} aria-hidden="true">
              <Icon className={styles.iconGlyph} weight="duotone" />
            </span>
            <span className={styles.segmentLabel}>{merchant.navLabel ?? merchant.name}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default MerchantNav;
