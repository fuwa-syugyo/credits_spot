import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    experimentalStudio: true,
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on) {
      on('task', {
        // deconstruct the individual properties
        setOptions() {
          return null
        },
      })
    },
  },
})
