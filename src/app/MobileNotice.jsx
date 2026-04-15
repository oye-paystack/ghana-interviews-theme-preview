import styles from "./MobileNotice.module.css";

function MobileNotice() {
  return (
    <div className={styles.root} role="alert" aria-live="polite">
      <div className={styles.content}>
        <p className={styles.heading}>GH Interview 2026</p>
        <p className={styles.subtext}>available on a desktop computer near you</p>
      </div>
    </div>
  );
}

export default MobileNotice;
