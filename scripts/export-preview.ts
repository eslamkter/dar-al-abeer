import { writeFile } from "node:fs/promises";
import { preview } from "../src/data/preview";
writeFile(
  process.argv[2] || "preview-settings.json",
  JSON.stringify(preview, null, 2),
);
