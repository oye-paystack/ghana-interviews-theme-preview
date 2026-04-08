import { Suspense, lazy, useState } from "react";
import AppShell from "./app/AppShell";
import SectionSideNav from "./app/SectionSideNav";
import {
  allThemeShowcaseMerchants,
  themeShowcaseThemes,
} from "./data/themeShowcase";
import OverviewSection from "./features/overview/OverviewSection";

const MerchantCardsSection = lazy(() =>
  import("./features/theme-showcase/MerchantCardsSection"),
);
const ThemeShowcaseSection = lazy(() =>
  import("./features/theme-showcase/ThemeShowcaseSection"),
);

function SectionFallback({ minHeight = 0 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        minHeight,
        width: "100%",
      }}
    />
  );
}

function App() {
  const [overviewSceneOffsetX, setOverviewSceneOffsetX] = useState(92);
  const [overviewSceneOffsetY, setOverviewSceneOffsetY] = useState(-44);
  const [overviewSceneScale, setOverviewSceneScale] = useState(1.2);
  const [showOverviewSceneFrame, setShowOverviewSceneFrame] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);

  return (
    <AppShell>
      {showSideNav ? <SectionSideNav /> : null}
      <OverviewSection
        sceneOffsetX={overviewSceneOffsetX}
        sceneOffsetY={overviewSceneOffsetY}
        sceneScale={overviewSceneScale}
        showSceneFrame={showOverviewSceneFrame}
      />
      <Suspense fallback={<SectionFallback minHeight={720} />}>
        <MerchantCardsSection merchants={allThemeShowcaseMerchants} />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight={1200} />}>
        <ThemeShowcaseSection
          themes={themeShowcaseThemes}
          merchants={allThemeShowcaseMerchants}
          initialActiveIndex={0}
          showDebugControls={!import.meta.env.PROD}
          overviewSceneOffsetX={overviewSceneOffsetX}
          overviewSceneOffsetY={overviewSceneOffsetY}
          overviewSceneScale={overviewSceneScale}
          showOverviewSceneFrame={showOverviewSceneFrame}
          showSideNav={showSideNav}
          onOverviewSceneOffsetXChange={setOverviewSceneOffsetX}
          onOverviewSceneOffsetYChange={setOverviewSceneOffsetY}
          onOverviewSceneScaleChange={setOverviewSceneScale}
          onShowOverviewSceneFrameChange={setShowOverviewSceneFrame}
          onShowSideNavChange={setShowSideNav}
        />
      </Suspense>
    </AppShell>
  );
}

export default App;
