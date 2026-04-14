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

if (typeof window.IntersectionObserver === "undefined") {
  class IntersectionObserverStub {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.IntersectionObserver = IntersectionObserverStub;
  global.IntersectionObserver = IntersectionObserverStub;
}

if (typeof HTMLMediaElement !== "undefined") {
  Object.defineProperty(HTMLMediaElement.prototype, "paused", {
    configurable: true,
    get() {
      return this._paused ?? true;
    },
  });

  Object.defineProperty(HTMLMediaElement.prototype, "ended", {
    configurable: true,
    get() {
      return this._ended ?? false;
    },
  });

  HTMLMediaElement.prototype.play = function play() {
    this._paused = false;
    this._ended = false;
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  };

  HTMLMediaElement.prototype.pause = function pause() {
    this._paused = true;
    this.dispatchEvent(new Event("pause"));
  };
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
