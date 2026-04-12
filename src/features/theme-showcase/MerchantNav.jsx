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
  className = "",
  variant = "default",
}) {
  const navVariantClassName = variant === "dark" ? styles.navDark : "";
  const navClassName = [styles.nav, navVariantClassName, className].filter(Boolean).join(" ");

  return (
    <nav className={navClassName} aria-label="Merchant carousel">
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
            key={`merchant-slot-${index}`}
            onClick={() => onSelect(index)}
          >
            <span className={styles.iconSlot} aria-hidden="true">
              <Icon className={styles.iconGlyph} weight="duotone" />
            </span>
            <span className={styles.segmentLabel}>
              {merchant.navLabel ?? merchant.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default MerchantNav;
