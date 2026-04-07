import { useState } from "react";
import AppShell from "./app/AppShell";
import SectionSideNav from "./app/SectionSideNav";
import {
  allThemeShowcaseMerchants,
  themeShowcaseThemes,
} from "./data/themeShowcase";
import OverviewSection from "./features/overview/OverviewSection";
import MerchantCardsSection from "./features/theme-showcase/MerchantCardsSection";
import ThemeShowcaseSection from "./features/theme-showcase/ThemeShowcaseSection";

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
      <MerchantCardsSection merchants={allThemeShowcaseMerchants} />
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
    </AppShell>
  );
}

export default App;
