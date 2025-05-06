import { defineConfig } from "vitest/config";
import react from "@astrojs/react";
import { fileURLToPath } from "node:url";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup/vitest.setup.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".astro", "e2e"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/", "**/*.d.ts", "**/*.config.*", "**/dist/**"],
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src"),
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src"),
    },
  },
});
