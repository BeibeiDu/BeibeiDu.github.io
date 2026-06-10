import { mkdir, copyFile } from "node:fs/promises";

await mkdir("dist/gppaq", { recursive: true });
await copyFile("dist/index.html", "dist/gppaq/index.html");
