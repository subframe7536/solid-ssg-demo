import { defineConfig } from 'vite'

import { getPrerenderPaths } from './src/demo-data'
import { solidSsgPlugin } from './src/vite-plugin'

export default defineConfig({
  plugins: solidSsgPlugin({
    mode: 'ssg',
    prerender: {
      routes: getPrerenderPaths,
    },
  }),
  build: {
    target: 'esnext',
  },
})
