import { defineConfig } from "commandkit";

export default defineConfig({
  src: "src",
  main: "index.js",
  watch: true,
  outDir: "dist",
  sourcemap: "inline",
});
