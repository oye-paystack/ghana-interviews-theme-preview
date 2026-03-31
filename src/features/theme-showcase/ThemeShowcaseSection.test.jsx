import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { themeShowcaseMerchants, themeShowcaseTheme } from "../../data/themeShowcase";
import ThemeShowcaseSection from "./ThemeShowcaseSection";

function renderThemeShowcase() {
  return render(
    <ThemeShowcaseSection
      theme={themeShowcaseTheme}
      merchants={themeShowcaseMerchants}
      initialActiveIndex={0}
      showDebugControls
    />,
  );
}

describe("ThemeShowcaseSection", () => {
  test("renders the initial merchant state", () => {
    renderThemeShowcase();

    expect(screen.getByRole("heading", { name: /africa world airlines/i })).toBeInTheDocument();
    expect(screen.getByText(/4x/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /listen to eric/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous merchant/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /africa world airlines/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("clamps next and previous navigation at the ends", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /next merchant/i }));
    fireEvent.click(screen.getByRole("button", { name: /next merchant/i }));

    expect(screen.getByRole("heading", { name: /^warc$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next merchant/i })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /previous merchant/i }));

    expect(screen.getByRole("heading", { name: /achieve by petra/i })).toBeInTheDocument();
  });

  test("selects a merchant from the icon navigation", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /warc/i }));

    expect(screen.getByRole("heading", { name: /^warc$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /warc/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /listen to felipe/i })).toBeInTheDocument();
  });

  test("updates cassette positions from the active index", () => {
    renderThemeShowcase();

    expect(screen.getByTestId("cassette-africa-world-airlines")).toHaveAttribute(
      "data-position",
      "center",
    );
    expect(screen.getByTestId("cassette-achieve-by-petra")).toHaveAttribute(
      "data-position",
      "right",
    );
    expect(screen.getByTestId("cassette-warc")).toHaveAttribute("data-position", "hidden-right");

    fireEvent.click(screen.getByRole("button", { name: /next merchant/i }));

    expect(screen.getByTestId("cassette-africa-world-airlines")).toHaveAttribute(
      "data-position",
      "left",
    );
    expect(screen.getByTestId("cassette-achieve-by-petra")).toHaveAttribute(
      "data-position",
      "center",
    );
    expect(screen.getByTestId("cassette-warc")).toHaveAttribute("data-position", "right");
  });

  test("updates the orbit spacing readout and css variable", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    const slider = screen.getByLabelText(/orbit spacing/i);
    fireEvent.change(slider, { target: { value: "420" } });

    expect(screen.getByText("420px")).toBeInTheDocument();
    expect(screen.getByTestId("theme-showcase-section")).toHaveStyle("--orbit-spacing: 420px");
  });

  test("keeps section state when the config popover opens and closes", () => {
    renderThemeShowcase();

    fireEvent.click(screen.getByRole("button", { name: /achieve by petra/i }));
    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    const slider = screen.getByLabelText(/orbit spacing/i);
    fireEvent.change(slider, { target: { value: "436" } });

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));
    expect(screen.queryByLabelText(/orbit spacing/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^config$/i }));

    expect(screen.getByRole("heading", { name: /achieve by petra/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/orbit spacing/i)).toHaveValue("436");
  });
});
