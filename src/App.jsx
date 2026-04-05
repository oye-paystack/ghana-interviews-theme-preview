import { useState } from "react";
import AppShell from "./app/AppShell";
import SectionSideNav from "./app/SectionSideNav";
import {
  allThemeShowcaseMerchants,
  themeShowcaseThemes,
} from "./data/themeShowcase";
import OverviewSection from "./features/overview/OverviewSection";
import ThemeShowcaseSection from "./features/theme-showcase/ThemeShowcaseSection";

function App() {
  const [overviewSceneOffsetX, setOverviewSceneOffsetX] = useState(200);
  const [overviewSceneOffsetY, setOverviewSceneOffsetY] = useState(-20);
  const [overviewSceneScale, setOverviewSceneScale] = useState(1.5);
  const [showOverviewSceneFrame, setShowOverviewSceneFrame] = useState(false);

  return (
    <AppShell>
      <SectionSideNav />
      <OverviewSection
        sceneOffsetX={overviewSceneOffsetX}
        sceneOffsetY={overviewSceneOffsetY}
        sceneScale={overviewSceneScale}
        showSceneFrame={showOverviewSceneFrame}
      />
      <ThemeShowcaseSection
        themes={themeShowcaseThemes}
        merchants={allThemeShowcaseMerchants}
        initialActiveIndex={0}
        showDebugControls={!import.meta.env.PROD}
        overviewSceneOffsetX={overviewSceneOffsetX}
        overviewSceneOffsetY={overviewSceneOffsetY}
        overviewSceneScale={overviewSceneScale}
        showOverviewSceneFrame={showOverviewSceneFrame}
        onOverviewSceneOffsetXChange={setOverviewSceneOffsetX}
        onOverviewSceneOffsetYChange={setOverviewSceneOffsetY}
        onOverviewSceneScaleChange={setOverviewSceneScale}
        onShowOverviewSceneFrameChange={setShowOverviewSceneFrame}
      />
    </AppShell>
  );
}

export default App;
