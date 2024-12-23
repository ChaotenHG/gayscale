import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  ase: "/gayscale/",
  plugins: [preact(), wasm(), topLevelAwait()],
});
