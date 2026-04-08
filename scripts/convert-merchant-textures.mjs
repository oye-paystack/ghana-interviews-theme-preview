import { readdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const textureDirectory = path.resolve("public/merchant-cards");
const maxWidth = Number.parseInt(process.env.TEXTURE_MAX_WIDTH ?? "1600", 10);

if (!Number.isFinite(maxWidth) || maxWidth <= 0) {
  throw new Error(`Invalid TEXTURE_MAX_WIDTH value: ${process.env.TEXTURE_MAX_WIDTH ?? ""}`);
}

async function main() {
  const entries = await readdir(textureDirectory, { withFileTypes: true });
  const sourceFiles = entries
    .filter((entry) => entry.isFile() && /\.(png|webp)$/u.test(entry.name))
    .map((entry) => entry.name);

  if (!sourceFiles.length) {
    console.log("No merchant textures found.");
    return;
  }

  for (const fileName of sourceFiles) {
    const inputPath = path.join(textureDirectory, fileName);
    const outputPath = path.join(textureDirectory, fileName.replace(/\.(png|webp)$/u, ".webp"));
    const tempOutputPath = `${outputPath}.tmp`;

    await sharp(inputPath)
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .webp({
        quality: 92,
        alphaQuality: 100,
        effort: 6,
      })
      .toFile(tempOutputPath);

    if (inputPath !== outputPath) {
      await rm(inputPath);
    }

    await rename(tempOutputPath, outputPath);
    console.log(`Converted ${fileName} -> ${path.basename(outputPath)} (${maxWidth}px max width)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
