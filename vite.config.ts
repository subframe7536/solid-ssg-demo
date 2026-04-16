import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { generateHydrationScript, getAssets } from 'solid-js/web'
import { build, defineConfig } from 'vite'
import type { Logger, Plugin, ResolvedConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

import { getPrerenderPaths } from './src/demo-data'

type RenderMode = 'spa' | 'ssr' | 'ssg'

type SolidRenderStrategyOptions = {
  mode: RenderMode
  routes?: string[]
  serverEntry?: string
}

const INTERNAL_SSR_BUILD_FLAG = 'SOLID_SSR_INTERNAL_BUILD'

function getServerEntryOutputFile(serverEntry: string) {
  return `${path.basename(serverEntry, path.extname(serverEntry))}.js`
}

function solidRenderStrategyPlugin(options: SolidRenderStrategyOptions): Plugin[] {
  const mode = options.mode
  const routes = options.routes ?? ['/']
  const serverEntry = options.serverEntry ?? 'src/entry-server.tsx'
  let resolvedConfig: ResolvedConfig | undefined
  let logger: Logger | undefined

  const getClientOutDir = () => {
    if (!resolvedConfig) {
      throw new Error('Vite config is not resolved yet.')
    }
    return path.resolve(resolvedConfig.root, resolvedConfig.build.outDir)
  }

  const getServerOutDir = () => {
    const clientOutDir = getClientOutDir()
    const distRoot =
      path.basename(clientOutDir) === 'client' ? path.dirname(clientOutDir) : clientOutDir
    return path.join(distRoot, 'server')
  }

  return [
    solidPlugin({
      ssr: mode !== 'spa',
    }),
    {
      name: 'vite-plugin-solid-render-strategy',
      configResolved(config) {
        resolvedConfig = config
        logger = config.logger
      },
      apply: (config, env) => {
        return (
          env.command === 'build' &&
          !config.build?.ssr &&
          process.env[INTERNAL_SSR_BUILD_FLAG] !== '1' &&
          mode !== 'spa'
        )
      },
      async generateBundle(_, bundle) {
        logger?.info(`[SSG] building server bundle (${mode})...`)

        const serverOutDir = getServerOutDir()

        process.env[INTERNAL_SSR_BUILD_FLAG] = '1'
        try {
          await build({
            build: {
              ssr: serverEntry,
              outDir: serverOutDir,
              emptyOutDir: false,
              target: 'esnext',
            },
          })
        } finally {
          delete process.env[INTERNAL_SSR_BUILD_FLAG]
        }

        if (mode !== 'ssg') {
          return
        }

        logger?.info('[SSG] pre-rendering static pages...')

        try {
          const serverEntryPath = pathToFileURL(
            path.join(serverOutDir, getServerEntryOutputFile(serverEntry)),
          ).href
          const ssrModule = await import(`${serverEntryPath}?t=${Date.now()}`)

          const indexHtml = bundle['index.html']
          const template =
            indexHtml && indexHtml.type === 'asset' && typeof indexHtml.source === 'string'
              ? indexHtml.source
              : fs.readFileSync(
                  path.join(resolvedConfig?.root ?? process.cwd(), 'index.html'),
                  'utf-8',
                )

          this.emitFile({
            type: 'asset',
            fileName: 'fallback.html',
            source: template,
          })

          for (const route of routes) {
            const { app } = await ssrModule.render({ url: route })
            const html = template
              .replace('<!--ssr-outlet-->', app)
              .replace('<!--ssr-head-->', generateHydrationScript())
              .replace('<!--ssr-assets-->', getAssets())

            this.emitFile({
              type: 'asset',
              fileName: route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`,
              source: html,
            })

            logger?.info(`[SSG] pre-rendered: ${route}`)
          }
        } catch (error) {
          logger?.error(`[SSG] pre-render failed: ${String(error)}`)
        }
      },
    },
  ]
}

export default defineConfig({
  plugins: solidRenderStrategyPlugin({
    mode: 'ssg',
    routes: getPrerenderPaths(),
  }),
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist/client',
    target: 'esnext',
  },
})
