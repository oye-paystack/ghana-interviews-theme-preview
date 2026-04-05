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

  return (
    <AppShell>
      <SectionSideNav />
      <OverviewSection
        sceneOffsetX={overviewSceneOffsetX}
        sceneOffsetY={overviewSceneOffsetY}
        sceneScale={overviewSceneScale}
      />
      <ThemeShowcaseSection
        themes={themeShowcaseThemes}
        merchants={allThemeShowcaseMerchants}
        initialActiveIndex={0}
        showDebugControls={!import.meta.env.PROD}
        overviewSceneOffsetX={overviewSceneOffsetX}
        overviewSceneOffsetY={overviewSceneOffsetY}
        overviewSceneScale={overviewSceneScale}
        onOverviewSceneOffsetXChange={setOverviewSceneOffsetX}
        onOverviewSceneOffsetYChange={setOverviewSceneOffsetY}
        onOverviewSceneScaleChange={setOverviewSceneScale}
      />
    </AppShell>
  );
}

export default App;
