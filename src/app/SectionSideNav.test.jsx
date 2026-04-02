import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import SectionSideNav from "./SectionSideNav";
import styles from "./SectionSideNav.module.css";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SectionSideNav", () => {
  test("renders the nav groups with the first theme item active by default", () => {
    render(<SectionSideNav />);

    expect(screen.getByRole("button", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^themes$/i })).toHaveClass(
      styles.groupLabelActive,
    );
    expect(screen.getByRole("button", { name: /reliable by default/i })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.queryByRole("button", { name: /what we did/i })).not.toBeInTheDocument();
  });

  test("updates the active item when a nav item is clicked", () => {
    render(<SectionSideNav />);

    fireEvent.click(screen.getByRole("button", { name: /roadmap/i }));
    fireEvent.click(screen.getByRole("button", { name: /what's next/i }));

    expect(screen.getByRole("button", { name: /what's next/i })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: /roadmap/i })).toHaveClass(
      styles.groupLabelActive,
    );
  });

  test("advances the active item with wheel input when the page cannot scroll further", () => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 900,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 900,
    });

    render(<SectionSideNav />);

    fireEvent.wheel(window, { deltaY: 120 });

    expect(screen.getByRole("button", { name: /growing past us/i })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
