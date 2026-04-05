import { useEffect, useRef } from "react";
import styles from "./ConfigPopover.module.css";

function ConfigPopover({
  spacing,
  sideCassetteOffsetY,
  textMorphDuration,
  textMorphEase,
  textMorphEaseString,
  playbackPulseDuration,
  themeSpacing,
  themeHoldDistance,
  currentCardExitScale,
  currentCardExitBlur,
  currentCardExitCompleteAt,
  footerSwitchAt,
  overviewSceneOffsetX,
  overviewSceneOffsetY,
  overviewSceneScale,
  showGridOverlay,
  showStickyGuide,
  isOpen,
  onToggle,
  onClose,
  onSpacingChange,
  onThemeSpacingChange,
  onThemeHoldDistanceChange,
  onCurrentCardExitScaleChange,
  onCurrentCardExitBlurChange,
  onCurrentCardExitCompleteAtChange,
  onFooterSwitchAtChange,
  onOverviewSceneOffsetXChange,
  onOverviewSceneOffsetYChange,
  onOverviewSceneScaleChange,
  onSideCassetteOffsetYChange,
  onTextMorphDurationChange,
  onPlaybackPulseDurationChange,
  onShowGridOverlayChange,
  onShowStickyGuideChange,
  onTextMorphEaseChange,
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (popoverRef.current?.contains(event.target)) {
        return;
      }

      onClose();
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onClose]);

  return (
    <aside
      className={`${styles.popover} ${isOpen ? styles.popoverOpen : ""}`}
      ref={popoverRef}
    >
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
          <label className={styles.toggleField} htmlFor="show-grid-overlay">
            <span className={styles.label}>Show grid overlay</span>
            <input
              id="show-grid-overlay"
              className={styles.checkbox}
              type="checkbox"
              checked={showGridOverlay}
              onChange={(event) => onShowGridOverlayChange(event.currentTarget.checked)}
            />
          </label>

          <label className={styles.toggleField} htmlFor="show-sticky-guide">
            <span className={styles.label}>Show sticky line</span>
            <input
              id="show-sticky-guide"
              className={styles.checkbox}
              type="checkbox"
              checked={showStickyGuide}
              onChange={(event) => onShowStickyGuideChange(event.currentTarget.checked)}
            />
          </label>

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

          <label className={styles.field} htmlFor="theme-spacing">
            <span className={styles.label}>Theme spacing</span>
            <span className={styles.value}>{themeSpacing}px</span>
          </label>
          <input
            className={styles.slider}
            id="theme-spacing"
            type="range"
            min="0"
            max="360"
            step="4"
            value={themeSpacing}
            onChange={(event) => onThemeSpacingChange(Number(event.currentTarget.value))}
          />

          <label className={styles.field} htmlFor="theme-hold-distance">
            <span className={styles.label}>Theme hold distance</span>
            <span className={styles.value}>{themeHoldDistance}px</span>
          </label>
          <input
            className={styles.slider}
            id="theme-hold-distance"
            type="range"
            min="0"
            max="240"
            step="4"
            value={themeHoldDistance}
            onChange={(event) => onThemeHoldDistanceChange(Number(event.currentTarget.value))}
          />

          <label className={styles.field} htmlFor="current-card-exit-scale">
            <span className={styles.label}>Current card exit scale</span>
            <span className={styles.value}>{currentCardExitScale.toFixed(2)}</span>
          </label>
          <input
            className={styles.slider}
            id="current-card-exit-scale"
            type="range"
            min="0.7"
            max="1"
            step="0.01"
            value={currentCardExitScale}
            onChange={(event) =>
              onCurrentCardExitScaleChange(Number(event.currentTarget.value))
            }
          />

          <label className={styles.field} htmlFor="current-card-exit-blur">
            <span className={styles.label}>Current card exit blur</span>
            <span className={styles.value}>{currentCardExitBlur}px</span>
          </label>
          <input
            className={styles.slider}
            id="current-card-exit-blur"
            type="range"
            min="0"
            max="24"
            step="1"
            value={currentCardExitBlur}
            onChange={(event) =>
              onCurrentCardExitBlurChange(Number(event.currentTarget.value))
            }
          />

          <label className={styles.field} htmlFor="current-card-exit-complete-at">
            <span className={styles.label}>Exit complete at</span>
            <span className={styles.value}>
              {Math.round(currentCardExitCompleteAt * 100)}%
            </span>
          </label>
          <input
            className={styles.slider}
            id="current-card-exit-complete-at"
            type="range"
            min="0.3"
            max="1"
            step="0.01"
            value={currentCardExitCompleteAt}
            onChange={(event) =>
              onCurrentCardExitCompleteAtChange(Number(event.currentTarget.value))
            }
          />

          <label className={styles.field} htmlFor="footer-switch-at">
            <span className={styles.label}>Footer switch at</span>
            <span className={styles.value}>{Math.round(footerSwitchAt * 100)}%</span>
          </label>
          <input
            className={styles.slider}
            id="footer-switch-at"
            type="range"
            min="0.5"
            max="1"
            step="0.01"
            value={footerSwitchAt}
            onChange={(event) => onFooterSwitchAtChange(Number(event.currentTarget.value))}
          />

          <label className={styles.field} htmlFor="side-cassette-offset-y">
            <span className={styles.label}>Side cassette Y offset</span>
            <span className={styles.value}>{sideCassetteOffsetY}px</span>
          </label>
          <input
            className={styles.slider}
            id="side-cassette-offset-y"
            type="range"
            min="-64"
            max="64"
            step="2"
            value={sideCassetteOffsetY}
            onChange={(event) =>
              onSideCassetteOffsetYChange(Number(event.currentTarget.value))
            }
          />

          <label className={styles.field} htmlFor="overview-scene-offset-x">
            <span className={styles.label}>Overview scene X</span>
            <span className={styles.value}>{overviewSceneOffsetX}px</span>
          </label>
          <input
            className={styles.slider}
            id="overview-scene-offset-x"
            type="range"
            min="-240"
            max="240"
            step="4"
            value={overviewSceneOffsetX}
            onChange={(event) =>
              onOverviewSceneOffsetXChange(Number(event.currentTarget.value))
            }
          />

          <label className={styles.field} htmlFor="overview-scene-offset-y">
            <span className={styles.label}>Overview scene Y</span>
            <span className={styles.value}>{overviewSceneOffsetY}px</span>
          </label>
          <input
            className={styles.slider}
            id="overview-scene-offset-y"
            type="range"
            min="-240"
            max="240"
            step="4"
            value={overviewSceneOffsetY}
            onChange={(event) =>
              onOverviewSceneOffsetYChange(Number(event.currentTarget.value))
            }
          />

          <label className={styles.field} htmlFor="overview-scene-scale">
            <span className={styles.label}>Overview scene scale</span>
            <span className={styles.value}>{overviewSceneScale.toFixed(2)}</span>
          </label>
          <input
            className={styles.slider}
            id="overview-scene-scale"
            type="range"
            min="0.5"
            max="1.5"
            step="0.01"
            value={overviewSceneScale}
            onChange={(event) =>
              onOverviewSceneScaleChange(Number(event.currentTarget.value))
            }
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

          <label className={styles.field} htmlFor="playback-pulse-duration">
            <span className={styles.label}>Playback pulse duration</span>
            <span className={styles.value}>{playbackPulseDuration}ms</span>
          </label>
          <input
            className={styles.slider}
            id="playback-pulse-duration"
            type="range"
            min="500"
            max="3200"
            step="50"
            value={playbackPulseDuration}
            onChange={(event) =>
              onPlaybackPulseDurationChange(Number(event.currentTarget.value))
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
