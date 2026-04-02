import { useEffect, useMemo, useRef, useState } from "react";
import { defaultSideNavItemId, sideNavGroups } from "../data/sideNav";
import styles from "./SectionSideNav.module.css";

const WHEEL_THRESHOLD = 90;
const WHEEL_COOLDOWN_MS = 180;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function SectionSideNav() {
  const flatItems = useMemo(
    () => sideNavGroups.flatMap((group) => group.items.map((item) => ({ ...item, groupId: group.id }))),
    [],
  );
  const [activeItemId, setActiveItemId] = useState(defaultSideNavItemId);
  const wheelAccumulatorRef = useRef(0);
  const lastStepAtRef = useRef(0);
  const edgeStateRef = useRef({
    atTop: true,
    atBottom: true,
    noScrollablePage: true,
  });

  useEffect(() => {
    function updateEdgeState() {
      const scrollElement = document.scrollingElement || document.documentElement;
      const maxScroll = Math.max(0, scrollElement.scrollHeight - window.innerHeight);
      const scrollY = window.scrollY || window.pageYOffset || 0;

      edgeStateRef.current = {
        atTop: scrollY <= 1,
        atBottom: scrollY >= maxScroll - 1,
        noScrollablePage: maxScroll <= 1,
      };
    }

    function stepActiveItem(direction) {
      setActiveItemId((currentId) => {
        const currentIndex = flatItems.findIndex((item) => item.id === currentId);
        const safeIndex = currentIndex === -1 ? 0 : currentIndex;
        const nextIndex = clamp(safeIndex + direction, 0, flatItems.length - 1);
        return flatItems[nextIndex].id;
      });
    }

    function onWheel(event) {
      const { atTop, atBottom, noScrollablePage } = edgeStateRef.current;
      const shouldDriveActiveItem =
        noScrollablePage || (event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom);

      if (!shouldDriveActiveItem) {
        wheelAccumulatorRef.current = 0;
        return;
      }

      wheelAccumulatorRef.current += event.deltaY;

      if (Math.abs(wheelAccumulatorRef.current) < WHEEL_THRESHOLD) {
        return;
      }

      const now = Date.now();
      if (now - lastStepAtRef.current < WHEEL_COOLDOWN_MS) {
        return;
      }

      const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
      stepActiveItem(direction);
      wheelAccumulatorRef.current = 0;
      lastStepAtRef.current = now;
    }

    updateEdgeState();

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", updateEdgeState, { passive: true });
    window.addEventListener("resize", updateEdgeState, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", updateEdgeState);
      window.removeEventListener("resize", updateEdgeState);
    };
  }, [flatItems]);

  return (
    <nav className={styles.nav} aria-label="Site sections">
      {sideNavGroups.map((group) => {
        const groupIsActive = group.items.some((item) => item.id === activeItemId);

        return (
          <section className={styles.group} key={group.id}>
            <button
              type="button"
              className={`${styles.groupLabel} ${groupIsActive ? styles.groupLabelActive : ""}`}
              onClick={() => setActiveItemId(group.items[0].id)}
            >
              {group.label}
            </button>

            {groupIsActive ? (
              <div className={styles.groupItems}>
                {group.items.map((item) => {
                  const isActive = item.id === activeItemId;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setActiveItemId(item.id)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </section>
        );
      })}
    </nav>
  );
}

export default SectionSideNav;
