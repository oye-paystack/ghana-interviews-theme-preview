import AppShell from "./app/AppShell";
import SectionSideNav from "./app/SectionSideNav";
import {
  themeShowcaseMerchants,
  themeShowcaseThemes,
} from "./data/themeShowcase";
import ThemeShowcaseSection from "./features/theme-showcase/ThemeShowcaseSection";

function App() {
  return (
    <AppShell>
      <SectionSideNav />
      <ThemeShowcaseSection
        themes={themeShowcaseThemes}
        merchants={themeShowcaseMerchants}
        initialActiveIndex={0}
        showDebugControls={!import.meta.env.PROD}
      />
    </AppShell>
  );
}

export default App;
