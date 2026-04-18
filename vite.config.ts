import { fileRouter } from 'solid-file-router/plugin'
import { defineConfig } from 'vite'

import { getPrerenderPaths } from './src/demo-data'
import { solid } from './src/vite-plugin'

export default defineConfig({
  plugins: [
    solid({
      mode: 'ssg',
      prerender: {
        routes: getPrerenderPaths,
      },
    }),
    fileRouter(),
  ],
  build: {
    target: 'esnext',
  },
})
