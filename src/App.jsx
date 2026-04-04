import AppShell from "./app/AppShell";
import SectionSideNav from "./app/SectionSideNav";
import {
  allThemeShowcaseMerchants,
  themeShowcaseThemes,
} from "./data/themeShowcase";
import ThemeShowcaseSection from "./features/theme-showcase/ThemeShowcaseSection";

function App() {
  return (
    <AppShell>
      <SectionSideNav />
      <ThemeShowcaseSection
        themes={themeShowcaseThemes}
        merchants={allThemeShowcaseMerchants}
        initialActiveIndex={0}
        showDebugControls={!import.meta.env.PROD}
      />
    </AppShell>
  );
}

export default App;
