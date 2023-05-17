import { defineConfig } from "cypress";
import viteConfig from "./vite.config"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
      viteConfig,
    },
    setupNodeEvents(on, config) {
      on('task', {
        // deconstruct the individual properties
        setOptions() {
          return null
        },
      })
    },
  },
});
