import cassetteSrc from "../Cassette.svg";
import playerShellSrc from "../Player Translucent.svg";
import quoteMarksSrc from "../Quotes.svg";
import playerGrillSrc from "../Grill.png";

const criticalFonts = [
  new URL(
    "../fonts/PP Mori - Upright Family v2.3/web/PPMori-Regular.woff2",
    import.meta.url,
  ).href,
  new URL(
    "../fonts/PP Mori - Upright Family v2.3/web/PPMori-Semibold.woff2",
    import.meta.url,
  ).href,
  new URL(
    "../fonts/PP Mori - Upright Family v2.3/web/PPMori-Medium.woff2",
    import.meta.url,
  ).href,
  new URL(
    "../fonts/PP Mori - Upright Family v2.3/web/PPMori-Bold.woff2",
    import.meta.url,
  ).href,
  new URL(
    "../fonts/PP Mori - Upright Family v2.3/web/PPMori-Black.woff2",
    import.meta.url,
  ).href,
];

const criticalImages = [playerShellSrc, playerGrillSrc, cassetteSrc, quoteMarksSrc];

function ensurePreload({ href, as, type }) {
  if (!href || document.head.querySelector(`link[rel="preload"][href="${href}"]`)) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;

  if (type) {
    link.type = type;
  }

  if (as === "font") {
    link.crossOrigin = "anonymous";
  }

  document.head.appendChild(link);
}

export function preloadCriticalAssets() {
  criticalFonts.forEach((href) =>
    ensurePreload({ href, as: "font", type: "font/woff2" }),
  );

  criticalImages.forEach((href) => ensurePreload({ href, as: "image" }));
}
