import styles from "./ConfigPopover.module.css";

function ConfigPopover({ spacing, isOpen, onToggle, onSpacingChange }) {
  return (
    <aside className={`${styles.popover} ${isOpen ? styles.popoverOpen : ""}`}>
      <button
        className={styles.summaryButton}
        type="button"
        aria-expanded={isOpen}
        aria-controls="theme-config-body"
        onClick={onToggle}
      >
        Config
      </button>

      {isOpen ? (
        <div className={styles.body} id="theme-config-body">
          <label className={styles.field} htmlFor="orbit-spacing">
            <span className={styles.label}>Orbit spacing</span>
            <span className={styles.value}>{spacing}px</span>
          </label>
          <input
            className={styles.slider}
            id="orbit-spacing"
            type="range"
            min="220"
            max="460"
            step="2"
            value={spacing}
            onChange={(event) => onSpacingChange(Number(event.currentTarget.value))}
          />
        </div>
      ) : null}
    </aside>
  );
}

export default ConfigPopover;
