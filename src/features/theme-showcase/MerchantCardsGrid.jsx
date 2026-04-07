import {
  AirplaneTilt,
  BuildingApartment,
  CellSignalFull,
  CellTower,
  Package,
  PiggyBank,
  Plant,
  ShoppingCart,
} from "@phosphor-icons/react";
import { Squircle } from "@cornerkit/react";
import styles from "./MerchantCardsGrid.module.css";

const iconMap = {
  airplaneTilt: AirplaneTilt,
  buildingApartment: BuildingApartment,
  cellSignalFull: CellSignalFull,
  cellTower: CellTower,
  package: Package,
  piggyBank: PiggyBank,
  plant: Plant,
  shoppingCart: ShoppingCart,
};

function MerchantCardsGrid({ merchants = [] }) {
  const orderedMerchants = [...merchants].sort(
    (left, right) =>
      (left.cardGridOrder ?? Number.MAX_SAFE_INTEGER)
      - (right.cardGridOrder ?? Number.MAX_SAFE_INTEGER),
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.grid} aria-label="Merchant cards overview">
        {orderedMerchants.map((merchant) => {
          const Icon = iconMap[merchant.cardIconKey] ?? Plant;

          return (
            <Squircle
              as="article"
              className={styles.card}
              key={merchant.id}
              radius={18}
              smoothing={0.9}
              style={{
                "--merchant-card-bg": merchant.cardBaseColor,
                "--merchant-card-texture-opacity": merchant.cardTextureOpacity ?? 1,
                "--merchant-card-texture-blend": merchant.cardTextureBlendMode ?? "plus-lighter",
                "--merchant-card-texture-width": merchant.cardTextureWidth ?? "100%",
                "--merchant-card-texture-height": merchant.cardTextureHeight ?? "100%",
                "--merchant-card-texture-left": merchant.cardTextureLeft ?? "0%",
                "--merchant-card-texture-top": merchant.cardTextureTop ?? "0%",
              }}
            >
              <div className={styles.surface} aria-hidden="true" />
              {merchant.cardTextureSrc ? (
                <img
                  alt=""
                  aria-hidden="true"
                  className={styles.texture}
                  loading="lazy"
                  src={merchant.cardTextureSrc}
                />
              ) : null}

              <div className={styles.content}>
                <span className={styles.iconFrame} aria-hidden="true">
                  <Icon className={styles.icon} weight="regular" />
                </span>
                <p className={styles.title}>{merchant.cardLabel ?? merchant.name}</p>
                <p className={styles.description}>{merchant.cardCategory}</p>
              </div>
            </Squircle>
          );
        })}
      </div>
    </div>
  );
}

export default MerchantCardsGrid;
