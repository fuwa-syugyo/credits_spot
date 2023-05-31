import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents() {
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
        setOptions() {
          return null
        },
      })
    },
  },
})
