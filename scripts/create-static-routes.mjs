import { mkdir, copyFile } from "node:fs/promises";

await mkdir("dist/gppaq", { recursive: true });
await mkdir("dist/gad7phq9", { recursive: true });
await mkdir("dist/gad7phqa", { recursive: true });
await copyFile("dist/index.html", "dist/gppaq/index.html");
await copyFile("dist/index.html", "dist/gad7phq9/index.html");
await copyFile("dist/index.html", "dist/gad7phqa/index.html");
