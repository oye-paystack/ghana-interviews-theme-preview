import { access, rename } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const textureDirectory = path.resolve("public/merchant-cards");
const textureSourceDirectory = path.resolve(
  process.env.TEXTURE_SOURCE_DIR ?? "public/merchant-cards",
);
const cardWidth = 418;
const cardHeight = 424;
const bleed = 24;
const referenceWidth = Number.parseInt(process.env.TEXTURE_REFERENCE_WIDTH ?? "0", 10);

if (!Number.isFinite(referenceWidth) || referenceWidth < 0) {
  throw new Error(
    `Invalid TEXTURE_REFERENCE_WIDTH value: ${process.env.TEXTURE_REFERENCE_WIDTH ?? ""}`,
  );
}

const textureTransforms = {
  "africa-world-airlines-texture.webp": {
    width: "465.66%",
    height: "344.19%",
    left: "-142.11%",
    top: "-94.8%",
  },
  "dajo-unimarket-texture.webp": {
    width: "294.97%",
    height: "218.03%",
    left: "-14.37%",
    top: "-72.33%",
  },
  "golly-express-texture.webp": {
    width: "259.23%",
    height: "191.61%",
    left: "-69.66%",
    top: "-33.85%",
  },
  "peadato-texture.webp": {
    width: "324.79%",
    height: "240.07%",
    left: "-152.18%",
    top: "-60.82%",
  },
  "petra-texture.webp": {
    width: "357.74%",
    height: "264.43%",
    left: "-116.67%",
    top: "-111.56%",
  },
  "seesail-texture.webp": {
    width: "513.2%",
    height: "379.33%",
    left: "-47.75%",
    top: "-163.95%",
  },
  "telecel-texture.webp": {
    width: "226.24%",
    height: "167.23%",
    left: "-116.67%",
    top: "-14.36%",
  },
  "warc-texture.webp": {
    width: "257.17%",
    height: "190.09%",
    left: "-5.73%",
    top: "-40.62%",
  },
};

function parsePercent(value) {
  return Number.parseFloat(String(value).replace("%", "")) / 100;
}

function calculateCrop(metadata, transform) {
  const sourceWidth = metadata.width;
  const sourceHeight = metadata.height;
  const displayWidth = parsePercent(transform.width) * cardWidth;
  const displayHeight = parsePercent(transform.height) * cardHeight;
  const left = parsePercent(transform.left) * cardWidth;
  const top = parsePercent(transform.top) * cardHeight;

  const visibleLeft = Math.max(0, left);
  const visibleTop = Math.max(0, top);
  const visibleRight = Math.min(cardWidth, left + displayWidth);
  const visibleBottom = Math.min(cardHeight, top + displayHeight);

  const expandedLeft = Math.max(left, visibleLeft - bleed);
  const expandedTop = Math.max(top, visibleTop - bleed);
  const expandedRight = Math.min(left + displayWidth, visibleRight + bleed);
  const expandedBottom = Math.min(top + displayHeight, visibleBottom + bleed);

  const cropLeft = Math.max(
    0,
    Math.floor(((expandedLeft - left) / displayWidth) * sourceWidth),
  );
  const cropTop = Math.max(
    0,
    Math.floor(((expandedTop - top) / displayHeight) * sourceHeight),
  );
  const cropWidth = Math.min(
    sourceWidth - cropLeft,
    Math.ceil(((expandedRight - expandedLeft) / displayWidth) * sourceWidth),
  );
  const cropHeight = Math.min(
    sourceHeight - cropTop,
    Math.ceil(((expandedBottom - expandedTop) / displayHeight) * sourceHeight),
  );

  const updatedTransform = {
    width: `${((((cropWidth / sourceWidth) * displayWidth) / cardWidth) * 100).toFixed(2)}%`,
    height: `${((((cropHeight / sourceHeight) * displayHeight) / cardHeight) * 100).toFixed(2)}%`,
    left: `${((expandedLeft / cardWidth) * 100).toFixed(2)}%`,
    top: `${((expandedTop / cardHeight) * 100).toFixed(2)}%`,
  };

  return {
    cropLeft,
    cropTop,
    cropWidth,
    cropHeight,
    updatedTransform,
  };
}

async function main() {
  for (const [fileName, transform] of Object.entries(textureTransforms)) {
    const inputFileName = fileName.replace(/\.webp$/u, ".png");
    const candidateSourcePath = path.join(textureSourceDirectory, inputFileName);
    const inputPath = path.join(textureDirectory, fileName);
    const tempOutputPath = `${inputPath}.tmp`;

    let sourcePath = inputPath;

    try {
      await access(candidateSourcePath);
      sourcePath = candidateSourcePath;
    } catch {
      sourcePath = inputPath;
    }

    const metadata = await sharp(sourcePath).metadata();
    const crop = calculateCrop(metadata, transform);

    let pipeline = sharp(sourcePath).extract({
      left: crop.cropLeft,
      top: crop.cropTop,
      width: crop.cropWidth,
      height: crop.cropHeight,
    });

    if (referenceWidth > 0 && metadata.width > referenceWidth) {
      pipeline = pipeline.resize({
        width: Math.max(1, Math.round((crop.cropWidth * referenceWidth) / metadata.width)),
        withoutEnlargement: true,
      });
    }

    await pipeline
      .webp({
        quality: 92,
        alphaQuality: 100,
        effort: 6,
      })
      .toFile(tempOutputPath);

    await rename(tempOutputPath, inputPath);

    console.log(
      `${path.basename(sourcePath)} -> ${fileName}: ${crop.cropWidth}x${crop.cropHeight} -> ` +
      `${crop.updatedTransform.width} ${crop.updatedTransform.height} ` +
      `${crop.updatedTransform.left} ${crop.updatedTransform.top}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
