import { defineConfig } from "vitest/config";
import Vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [
    Vue()
  ],
  test: {
    globals: true,
    environment: "jsdom"
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
