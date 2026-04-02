import AppShell from "./app/AppShell";
import SectionSideNav from "./app/SectionSideNav";
import { themeShowcaseMerchants, themeShowcaseTheme } from "./data/themeShowcase";
import ThemeShowcaseSection from "./features/theme-showcase/ThemeShowcaseSection";

function App() {
  return (
    <AppShell>
      <SectionSideNav />
      <ThemeShowcaseSection
        theme={themeShowcaseTheme}
        merchants={themeShowcaseMerchants}
        initialActiveIndex={0}
        showDebugControls
      />
    </AppShell>
  );
}

export default App;
