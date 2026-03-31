import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { afterEach, vi } from "vitest";

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

vi.mock("torph/react", () => ({
  TextMorph: ({ as = "span", children, className, style }) =>
    createElement(as, { className, style }, children),
  useTextMorph: () => ({
    ref: { current: null },
    update: () => {},
  }),
}));

afterEach(() => {
  cleanup();
});
