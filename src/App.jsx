import { Suspense, lazy, useState } from "react";
import AppShell from "./app/AppShell";
import PalettePicker from "./app/PalettePicker";
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
const RoadmapSection = lazy(() => import("./features/roadmap/RoadmapSection"));
const InsightsSection = lazy(() => import("./features/insights/InsightsSection"));

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
  const [merchantHoverPreviewSize, setMerchantHoverPreviewSize] = useState(760);
  const [showRoadmapLabelMotion, setShowRoadmapLabelMotion] = useState(true);
  const [showRoadmapInlineLabels, setShowRoadmapInlineLabels] = useState(true);

  return (
    <AppShell>
      {showSideNav ? <SectionSideNav /> : null}
      <OverviewSection />
      <Suspense fallback={<SectionFallback minHeight={720} />}>
        <MerchantCardsSection
          hoverPreviewSize={merchantHoverPreviewSize}
          merchants={allThemeShowcaseMerchants}
        />
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
          merchantHoverPreviewSize={merchantHoverPreviewSize}
          showRoadmapLabelMotion={showRoadmapLabelMotion}
          showRoadmapInlineLabels={showRoadmapInlineLabels}
          onOverviewSceneOffsetXChange={setOverviewSceneOffsetX}
          onOverviewSceneOffsetYChange={setOverviewSceneOffsetY}
          onOverviewSceneScaleChange={setOverviewSceneScale}
          onShowOverviewSceneFrameChange={setShowOverviewSceneFrame}
          onShowSideNavChange={setShowSideNav}
          onMerchantHoverPreviewSizeChange={setMerchantHoverPreviewSize}
          onShowRoadmapLabelMotionChange={setShowRoadmapLabelMotion}
          onShowRoadmapInlineLabelsChange={setShowRoadmapInlineLabels}
        />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight={960} />}>
        <RoadmapSection
          showInlineLabels={showRoadmapInlineLabels}
          showLabelMotion={showRoadmapLabelMotion}
        />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight={400} />}>
        <InsightsSection />
      </Suspense>
      <PalettePicker />
    </AppShell>
  );
}

export default App;
