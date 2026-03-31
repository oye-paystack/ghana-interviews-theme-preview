import AppShell from "./app/AppShell";
import { themeShowcaseMerchants, themeShowcaseTheme } from "./data/themeShowcase";
import ThemeShowcaseSection from "./features/theme-showcase/ThemeShowcaseSection";

function App() {
  return (
    <AppShell>
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
