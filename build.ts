import { build } from "bun";
import { chmod } from "node:fs/promises";

// Run the build
const result = await build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}

// Add shebang to the output file
const filePath = "./dist/index.js";
const file = Bun.file(filePath);
const content = await file.text();

if (!content.startsWith("#!/usr/bin/env node")) {
  const newContent = "#!/usr/bin/env node\n" + content;
  await Bun.write(filePath, newContent);
}

// Make the file executable
await chmod(filePath, 0o755);

console.log(
  "Build complete: dist/index.js created with shebang and executable permissions."
);
