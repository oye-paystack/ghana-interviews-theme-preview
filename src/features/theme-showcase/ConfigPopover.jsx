import styles from "./ConfigPopover.module.css";

function ConfigPopover({
  spacing,
  textMorphDuration,
  textMorphEase,
  textMorphEaseString,
  isOpen,
  onToggle,
  onSpacingChange,
  onTextMorphDurationChange,
  onTextMorphEaseChange,
}) {
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

          <label className={styles.field} htmlFor="text-morph-duration">
            <span className={styles.label}>Text morph duration</span>
            <span className={styles.value}>{textMorphDuration}ms</span>
          </label>
          <input
            className={styles.slider}
            id="text-morph-duration"
            type="range"
            min="120"
            max="480"
            step="10"
            value={textMorphDuration}
            onChange={(event) =>
              onTextMorphDurationChange(Number(event.currentTarget.value))
            }
          />

          <div className={styles.group}>
            <div className={styles.field}>
              <span className={styles.label}>Bezier curve</span>
              <span className={styles.value}>{textMorphEaseString}</span>
            </div>

            <div className={styles.bezierGrid}>
              {textMorphEase.map((value, index) => (
                <label
                  className={styles.pointField}
                  htmlFor={`text-morph-ease-${index}`}
                  key={`text-morph-ease-${index}`}
                >
                  <span className={styles.pointLabel}>
                    {index === 0 || index === 2 ? `x${index === 0 ? 1 : 2}` : `y${index === 1 ? 1 : 2}`}
                  </span>
                  <input
                    className={styles.numberInput}
                    id={`text-morph-ease-${index}`}
                    type="number"
                    inputMode="decimal"
                    min={index === 0 || index === 2 ? "0" : "-1.5"}
                    max={index === 0 || index === 2 ? "1" : "2"}
                    step="0.01"
                    value={value}
                    onChange={(event) =>
                      onTextMorphEaseChange(index, Number(event.currentTarget.value))
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export default ConfigPopover;
