import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { generateHydrationScript, getAssets } from 'solid-js/web'
import type { Logger, Plugin, ResolvedConfig } from 'vite'
import { normalizePath } from 'vite'
import solidPlugin from 'vite-plugin-solid'

type Awaitable<T> = T | Promise<T>

type BundleAsset = {
  type: 'asset'
  fileName: string
  source: string | Uint8Array
}

type BundleChunk = {
  type: 'chunk'
  fileName: string
  facadeModuleId?: string | null
  isEntry?: boolean
}

type BundleOutput = Record<string, BundleAsset | BundleChunk>

export type SolidBuildMode = 'spa' | 'ssr' | 'ssg'

const ENVIRONMENT_CLIENT = 'client'
const ENVIRONMENT_SERVER = 'ssr'
const INDEX_HTML_FILE_NAME = 'index.html'
const MODE_SPA: SolidBuildMode = 'spa'
const MODE_SSG: SolidBuildMode = 'ssg'

type EnvironmentName = typeof ENVIRONMENT_CLIENT | typeof ENVIRONMENT_SERVER

export type PrerenderRoutesSource = readonly string[] | (() => Awaitable<readonly string[]>)

export interface SolidSsgPluginOptions {
  mode?: SolidBuildMode
  serverEntry?: string
  prerender?: {
    routes?: PrerenderRoutesSource
    concurrency?: number
  }
}

function getPrerenderAssetFileName(route: string) {
  const trimmedRoute = route.trim()
  const normalizedRoute =
    !trimmedRoute || trimmedRoute === '/'
      ? '/'
      : (trimmedRoute.startsWith('/') ? trimmedRoute : `/${trimmedRoute}`).replace(/\/+$/, '') ||
        '/'

  if (normalizedRoute === '/') {
    return INDEX_HTML_FILE_NAME
  }

  const segments = normalizedRoute.slice(1).split('/')
  const lastSegment = segments.pop()!

  return path.posix.join(...segments, `${lastSegment}.html`)
}

function findIndexHtmlAsset(bundle: BundleOutput) {
  const htmlAsset = Object.values(bundle).find(
    (item): item is BundleAsset => item.type === 'asset' && item.fileName === INDEX_HTML_FILE_NAME,
  )

  if (!htmlAsset) {
    throw new Error(`Missing client ${INDEX_HTML_FILE_NAME} asset in bundle`)
  }

  return htmlAsset
}

function findSsrEntryChunk(bundle: BundleOutput, root: string, serverEntry: string) {
  const resolvedServerEntry = normalizePath(path.resolve(root, serverEntry))
  const entryChunks = Object.values(bundle).filter(
    (item): item is BundleChunk => item.type === 'chunk' && !!item.isEntry,
  )

  return (
    entryChunks.find((item) => normalizePath(item.facadeModuleId ?? '') === resolvedServerEntry) ??
    entryChunks[0]
  )
}

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
) {
  const results = new Array<R>(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await mapper(items[currentIndex], currentIndex)
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()))

  return results
}

async function loadServerRenderer(config: ResolvedConfig, entryFileName: string) {
  const serverOutDir = path.resolve(
    config.root,
    config.environments[ENVIRONMENT_SERVER].build.outDir,
  )
  const serverEntryUrl = pathToFileURL(path.join(serverOutDir, entryFileName)).href
  return import(`${serverEntryUrl}?t=${Date.now()}`)
}

function renderTemplate(template: string, app: string) {
  return template
    .replace('<!--ssr-outlet-->', app)
    .replace('<!--ssr-head-->', generateHydrationScript())
    .replace('<!--ssr-assets-->', getAssets())
}

export function solidSsgPlugin(options: SolidSsgPluginOptions = {}): Plugin[] {
  const {
    mode = MODE_SSG,
    serverEntry = 'src/entry-server.tsx',
    prerender: { routes = ['/'], concurrency = 4 } = {},
  } = options
  const prerenderConcurrency = Math.max(1, concurrency)
  let logger: Logger | undefined
  let serverEntryFileName: string | undefined

  return [
    solidPlugin({ ssr: mode !== MODE_SPA }),
    {
      name: 'solid-ssg-environment-api',
      sharedDuringBuild: true,
      apply(_, env) {
        return mode === MODE_SSG && env.command === 'build'
      },
      config(userConfig) {
        const getOutDir = (envName: EnvironmentName, subDir: string) =>
          path.join(userConfig.environments?.[envName]?.build?.outDir ?? 'dist', subDir)
        return {
          builder: {
            async buildApp(builder) {
              await builder.build(builder.environments[ENVIRONMENT_SERVER])
              await builder.build(builder.environments[ENVIRONMENT_CLIENT])
            },
          },
          environments: {
            [ENVIRONMENT_CLIENT]: {
              build: {
                outDir: getOutDir(ENVIRONMENT_CLIENT, 'client'),
              },
            },
            [ENVIRONMENT_SERVER]: {
              build: {
                outDir: getOutDir(ENVIRONMENT_SERVER, 'server'),
                ssr: serverEntry,
              },
            },
          },
        }
      },
      configResolved(config) {
        logger = config.logger
      },
      generateBundle: {
        order: 'post',
        async handler(_outputOptions, bundle) {
          if (this.environment.name === ENVIRONMENT_SERVER) {
            const ssrEntryChunk = findSsrEntryChunk(
              bundle,
              this.environment.config.root,
              serverEntry,
            )
            if (!ssrEntryChunk) {
              this.error(`Missing SSR entry chunk for ${serverEntry}`)
            }

            serverEntryFileName = ssrEntryChunk.fileName
            return
          }

          if (this.environment.name !== ENVIRONMENT_CLIENT || mode !== MODE_SSG) {
            return
          }

          const rendererEntryFileName = serverEntryFileName
          if (!rendererEntryFileName) {
            this.error('Missing SSR renderer output before prerendering client routes')
            return
          }

          const indexHtmlAsset = findIndexHtmlAsset(bundle)
          const htmlTemplate =
            typeof indexHtmlAsset.source === 'string'
              ? indexHtmlAsset.source
              : Buffer.from(indexHtmlAsset.source).toString('utf-8')
          const resolvedRoutes = typeof routes === 'function' ? await routes() : routes
          const prerenderRoutes = [
            ...new Set(
              resolvedRoutes.map((route) => {
                const trimmedRoute = route.trim()

                if (!trimmedRoute || trimmedRoute === '/') {
                  return '/'
                }

                const routeWithLeadingSlash = trimmedRoute.startsWith('/')
                  ? trimmedRoute
                  : `/${trimmedRoute}`

                return routeWithLeadingSlash.replace(/\/+$/, '') || '/'
              }),
            ),
          ]
          const serverRenderer = await loadServerRenderer(
            this.environment.config,
            rendererEntryFileName,
          )

          this.emitFile({
            type: 'asset',
            fileName: '404.html',
            source: htmlTemplate,
          })

          if (!prerenderRoutes.length) {
            logger?.info('[solid-ssg] emitted 404 fallback; no prerender routes configured')
            return
          }
          const base = this.environment.config.base
          const basePath = base === '/' ? '' : base.replace(/\/$/, '')

          const renderedRoutes = await mapWithConcurrency(
            prerenderRoutes,
            prerenderConcurrency,
            async (route) => {
              const { app } = await serverRenderer.render({
                url: basePath + route,
              })

              return {
                route,
                html: renderTemplate(htmlTemplate, app),
              }
            },
          )

          for (const renderedRoute of renderedRoutes) {
            if (renderedRoute.route === '/') {
              indexHtmlAsset.source = renderedRoute.html
              continue
            }

            this.emitFile({
              type: 'asset',
              fileName: getPrerenderAssetFileName(renderedRoute.route),
              source: renderedRoute.html,
            })
          }

          logger?.info(
            `[solid-ssg] prerendered ${prerenderRoutes.length} routes with concurrency ${prerenderConcurrency}`,
          )
        },
      },
    },
  ]
}
