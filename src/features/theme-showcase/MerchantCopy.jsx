import { Fragment } from "react";
import styles from "./MerchantCopy.module.css";

function MerchantCopy({ merchant }) {
  return (
    <div className={styles.copy}>
      <h2 className={styles.title}>{merchant.name}</h2>
      <p className={styles.body}>
        {merchant.copy.map((segment, index) => {
          if (typeof segment === "string") {
            return <Fragment key={`${merchant.id}-segment-${index}`}>{segment}</Fragment>;
          }

          return (
            <span className={styles.highlight} key={`${merchant.id}-segment-${index}`}>
              {segment.highlight}
            </span>
          );
        })}
      </p>
    </div>
  );
}

export default MerchantCopy;
