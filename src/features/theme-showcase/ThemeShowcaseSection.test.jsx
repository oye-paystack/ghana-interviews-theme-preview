import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { themeShowcaseMerchants, themeShowcaseTheme } from "../../data/themeShowcase";
import ThemeShowcaseSection from "./ThemeShowcaseSection";

function renderThemeShowcase() {
  function TestHarness() {
    const [overviewSceneOffsetX, setOverviewSceneOffsetX] = useState(0);
    const [overviewSceneOffsetY, setOverviewSceneOffsetY] = useState(0);
    const [overviewSceneScale, setOverviewSceneScale] = useState(1);
    const [showOverviewSceneFrame, setShowOverviewSceneFrame] = useState(false);

    return (
      <ThemeShowcaseSection
        theme={themeShowcaseTheme}
        merchants={themeShowcaseMerchants}
        initialActiveIndex={0}
        showDebugControls
        overviewSceneOffsetX={overviewSceneOffsetX}
        overviewSceneOffsetY={overviewSceneOffsetY}
        overviewSceneScale={overviewSceneScale}
        showOverviewSceneFrame={showOverviewSceneFrame}
        onOverviewSceneOffsetXChange={setOverviewSceneOffsetX}
        onOverviewSceneOffsetYChange={setOverviewSceneOffsetY}
        onOverviewSceneScaleChange={setOverviewSceneScale}
        onShowOverviewSceneFrameChange={setShowOverviewSceneFrame}
      />
    );
  }

  return render(
    <TestHarness />,
  );
}

describe("ThemeShowcaseSection", () => {
  test("renders the initial merchant state", () => {
    renderThemeShowcase();

    expect(screen.getByRole("heading", { name: /^seesail$/i })).toBeInTheDocument();
    expect(screen.getByText(/matured api/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /listen to victor/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^seesail$/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("toggles the playback button label and pressed state", () => {
    renderThemeShowcase();

    const listenButton = screen.getByRole("button", { name: /listen to victor/i });
    const merchantCopy = screen.getByTestId("merchant-copy");

    expect(merchantCopy).toHaveAttribute("data-playing", "false");

    fireEvent.click(listenButton);

    expect(screen.getByRole("button", { name: /stop playback/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("cassette-seesail")).toHaveAttribute(
      "data-playing",
      "true",
    );
    expect(screen.getByTestId("playback-indicator")).toHaveAttribute("data-playing", "true");
    expect(merchantCopy).toHaveAttribute("data-playing", "true");

    fireEvent.click(screen.getByRole("button", { name: /stop playback/i }));

    expect(screen.getByRole("button", { name: /listen to victor/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByTestId("cassette-seesail")).toHaveAttribute(
      "data-playing",
      "false",
    );
    expect(screen.getByTestId("playback-indicator")).toHaveAttribute("data-playing", "false");
    expect(merchantCopy).toHaveAttribute("data-playing", "false");
  });

  test("resets playback button state when the merchant changes", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /listen to victor/i }));
    fireEvent.click(screen.getByRole("button", { name: /^warc$/i }));

    expect(screen.getByRole("button", { name: /listen to felipe/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByTestId("cassette-warc")).toHaveAttribute(
      "data-playing",
      "false",
    );
    expect(screen.getByTestId("merchant-copy")).toHaveAttribute("data-playing", "false");
  });

  test("selects a merchant from the icon navigation", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^warc$/i }));

    expect(screen.getByRole("heading", { name: /^warc$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^warc$/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /listen to felipe/i })).toBeInTheDocument();
  });

  test("updates cassette positions from the active index", () => {
    renderThemeShowcase();

    expect(screen.getByTestId("cassette-seesail")).toHaveAttribute(
      "data-position",
      "center",
    );
    expect(screen.getByTestId("cassette-warc")).toHaveAttribute(
      "data-position",
      "hidden-right",
    );
    expect(screen.getByTestId("cassette-africa-world-airlines")).toHaveAttribute(
      "data-position",
      "right",
    );

    fireEvent.click(screen.getByRole("button", { name: /^warc$/i }));

    expect(screen.getByTestId("cassette-seesail")).toHaveAttribute(
      "data-position",
      "hidden-left",
    );
    expect(screen.getByTestId("cassette-warc")).toHaveAttribute(
      "data-position",
      "center",
    );
    expect(screen.getByTestId("cassette-africa-world-airlines")).toHaveAttribute(
      "data-position",
      "left",
    );
  });

  test("updates the orbit spacing readout and css variable", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    const slider = screen.getByLabelText(/orbit spacing/i);
    fireEvent.change(slider, { target: { value: "420" } });

    expect(screen.getByText("420px")).toBeInTheDocument();
    expect(screen.getByTestId("theme-showcase-section")).toHaveStyle("--orbit-spacing: 420px");
  });

  test("updates the theme spacing readout and css variable", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    const slider = screen.getByLabelText(/theme spacing/i);
    fireEvent.change(slider, { target: { value: "96" } });

    expect(screen.getByText("96px")).toBeInTheDocument();
    expect(screen.getByTestId("theme-showcase-section")).toHaveStyle("--theme-slide-gap: 96px");
  });

  test("updates the theme hold distance readout and css variable", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    const slider = screen.getByLabelText(/theme hold distance/i);
    fireEvent.change(slider, { target: { value: "132" } });

    expect(screen.getByText("132px")).toBeInTheDocument();
    expect(screen.getByTestId("theme-showcase-section")).toHaveStyle(
      "--theme-hold-distance: 132px",
    );
  });

  test("updates current card exit controls from the config popover", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    fireEvent.change(screen.getByLabelText(/current card exit scale/i), {
      target: { value: "0.85" },
    });
    fireEvent.change(screen.getByLabelText(/current card exit blur/i), {
      target: { value: "14" },
    });
    fireEvent.change(screen.getByLabelText(/exit complete at/i), {
      target: { value: "0.62" },
    });

    expect(screen.getByText("0.85")).toBeInTheDocument();
    expect(screen.getByText("14px")).toBeInTheDocument();
    expect(screen.getByText("62%")).toBeInTheDocument();
    expect(screen.getByTestId("theme-showcase-section")).toHaveStyle(
      "--current-card-exit-scale: 0.85",
    );
    expect(screen.getByTestId("theme-showcase-section")).toHaveStyle(
      "--current-card-exit-blur: 14px",
    );
    expect(screen.getByTestId("theme-showcase-section")).toHaveStyle(
      "--current-card-exit-complete-at: 62%",
    );
  });

  test("updates footer switch threshold from the config popover", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    fireEvent.change(screen.getByLabelText(/footer switch at/i), {
      target: { value: "0.88" },
    });

    expect(screen.getByText("88%")).toBeInTheDocument();
    expect(screen.getByTestId("theme-showcase-section")).toHaveStyle(
      "--footer-switch-at: 88%",
    );
  });

  test("updates the side cassette offset from the config popover", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    fireEvent.change(screen.getByLabelText(/side cassette y offset/i), {
      target: { value: "24" },
    });

    expect(screen.getByText("24px")).toBeInTheDocument();
    expect(screen.getByLabelText(/cassette player/i).querySelector("[data-side-offset-y]")).toHaveAttribute(
      "data-side-offset-y",
      "24",
    );
  });

  test("updates overview scene controls from the config popover", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    fireEvent.change(screen.getByLabelText(/overview scene x/i), {
      target: { value: "48" },
    });
    fireEvent.change(screen.getByLabelText(/overview scene y/i), {
      target: { value: "-24" },
    });
    fireEvent.change(screen.getByLabelText(/overview scene scale/i), {
      target: { value: "1.15" },
    });

    expect(screen.getByText("48px")).toBeInTheDocument();
    expect(screen.getByText("-24px")).toBeInTheDocument();
    expect(screen.getByText("1.15")).toBeInTheDocument();
  });

  test("toggles the overview scene frame control", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    const toggle = screen.getByLabelText(/show overview frame/i);
    expect(toggle).not.toBeChecked();

    fireEvent.click(toggle);

    expect(toggle).toBeChecked();
  });

  test("updates text morph controls from the config popover", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    fireEvent.change(screen.getByLabelText(/text morph duration/i), {
      target: { value: "260" },
    });
    fireEvent.change(screen.getByLabelText(/^x1$/i), {
      target: { value: "0.23" },
    });
    fireEvent.change(screen.getByLabelText(/^y1$/i), {
      target: { value: "0.88" },
    });
    fireEvent.change(screen.getByLabelText(/^x2$/i), {
      target: { value: "0.32" },
    });
    fireEvent.change(screen.getByLabelText(/^y2$/i), {
      target: { value: "1" },
    });

    const listenButton = screen.getByRole("button", { name: /listen to victor/i });

    expect(listenButton).toHaveAttribute("data-text-morph-duration", "260");
    expect(listenButton).toHaveAttribute(
      "data-text-morph-ease",
      "cubic-bezier(0.23, 0.88, 0.32, 1)",
    );
  });

  test("updates playback pulse duration from the config popover", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));
    fireEvent.change(screen.getByLabelText(/playback pulse duration/i), {
      target: { value: "1850" },
    });

    expect(screen.getByText("1850ms")).toBeInTheDocument();
    expect(screen.getByTestId("playback-indicator")).toHaveAttribute(
      "data-pulse-duration",
      "1850",
    );
  });

  test("toggles the grid overlay from the config popover", () => {
    renderThemeShowcase();

    const section = screen.getByTestId("theme-showcase-section");
    expect(section).toHaveAttribute("data-show-grid", "false");

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));
    fireEvent.click(screen.getByLabelText(/show grid overlay/i));

    expect(section).toHaveAttribute("data-show-grid", "true");
  });

  test("toggles the sticky guide from the config popover", () => {
    renderThemeShowcase();

    const section = screen.getByTestId("theme-showcase-section");
    expect(section).toHaveAttribute("data-show-sticky-guide", "false");

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));
    fireEvent.click(screen.getByLabelText(/show sticky line/i));

    expect(section).toHaveAttribute("data-show-sticky-guide", "true");
  });

  test("keeps section state when the config popover opens and closes", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^seesail$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    const slider = screen.getByLabelText(/orbit spacing/i);
    fireEvent.change(slider, { target: { value: "436" } });

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));
    expect(screen.queryByLabelText(/orbit spacing/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    expect(screen.getByRole("heading", { name: /^seesail$/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/orbit spacing/i)).toHaveValue("436");
  });

  test("closes the config popover when clicking outside it", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));
    expect(screen.getByLabelText(/orbit spacing/i)).toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    expect(screen.queryByLabelText(/orbit spacing/i)).not.toBeInTheDocument();
  });
});
