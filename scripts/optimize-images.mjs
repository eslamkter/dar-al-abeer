import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
const input = path.resolve("assets/source"),
  output = path.resolve("public/images");
await mkdir(output, { recursive: true });
for (const file of await readdir(input)) {
  if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
  const dest = path.join(output, file.replace(/\.[^.]+$/, ".webp")),
    src = path.join(input, file);
  if (
    await stat(dest)
      .then(async (d) => d.mtimeMs > (await stat(src)).mtimeMs)
      .catch(() => false)
  )
    continue;
  await sharp(src)
    .resize({
      width: file.startsWith("hero") ? 1800 : 1000,
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toFile(dest);
  console.log(file, "→", path.basename(dest));
}
