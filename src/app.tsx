import './styles.css'

import { A, Route, Router } from '@solidjs/router'
import type { RouteSectionProps } from '@solidjs/router'
import { For, Suspense, lazy } from 'solid-js'

import { getPrerenderPaths, labs, projects } from './demo-data'

const HomePage = lazy(() => import('./pages/home'))
const ProjectsPage = lazy(() => import('./pages/projects'))
const ProjectPage = lazy(() => import('./pages/project'))
const LabsPage = lazy(() => import('./pages/labs'))
const LabPage = lazy(() => import('./pages/lab'))
const NotFoundPage = lazy(() => import('./pages/not-found'))
const viteBase = import.meta.env.BASE_URL
const routerBase = viteBase === '/' ? '/' : viteBase.replace(/\/$/, '')
const appBasePath = routerBase === '/' ? '' : routerBase

function stripAppBase(pathname: string) {
  if (!appBasePath || !pathname.startsWith(appBasePath)) {
    return pathname
  }

  const stripped = pathname.slice(appBasePath.length)
  return stripped || '/'
}

const navItems = [
  {
    href: '/',
    title: 'Overview',
    summary: 'The demo entry point and route map.',
  },
  {
    href: '/projects',
    title: 'Projects',
    summary: 'Lazy-loaded lists and dynamic detail routes.',
  },
  {
    href: '/labs',
    title: 'Labs',
    summary: 'Focused experiments with concrete branch pages.',
  },
]

function AppShell(props: RouteSectionProps) {
  const currentPath = () => `${stripAppBase(props.location.pathname)}${props.location.search}`
  const totalCheckpoints = projects.reduce(
    (count, project) => count + project.checkpoints.length,
    0,
  )
  const prerenderCount = getPrerenderPaths().length

  return (
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-mark" />
          <div class="brand-copy">
            <p class="eyebrow">Solid SSG demo</p>
            <h1>Router blueprint</h1>
          </div>
        </div>

        <nav class="nav-list">
          <For each={navItems}>
            {(item) => (
              <A class="nav-link" end={item.href === '/'} href={item.href}>
                <strong>{item.title}</strong>
                <small>{item.summary}</small>
              </A>
            )}
          </For>
        </nav>

        <div class="sidebar-note">
          <p class="eyebrow">Pre-rendered</p>
          <strong>{prerenderCount} concrete routes</strong>
          <p>
            Static paths and dynamic branches come from the same data module so the build and the
            client stay aligned.
          </p>

          <div class="sidebar-stats">
            <div class="stat-card">
              <span>Projects</span>
              <strong>{projects.length}</strong>
            </div>
            <div class="stat-card">
              <span>Checkpoints</span>
              <strong>{totalCheckpoints}</strong>
            </div>
            <div class="stat-card">
              <span>Labs</span>
              <strong>{labs.length}</strong>
            </div>
            <div class="stat-card">
              <span>Chunks</span>
              <strong>lazy()</strong>
            </div>
          </div>
        </div>
      </aside>

      <main class="workspace">
        <header class="topbar">
          <div class="topbar-copy">
            <p class="eyebrow">Current route</p>
            <h2 class="section-title">{currentPath()}</h2>
            <p>
              The shell stays mounted while Solid Router swaps lazy-loaded route modules in and out
              of the outlet.
            </p>
          </div>

          <div class="path-pill">{currentPath()}</div>
        </header>

        <div class="shell-outlet">
          <Suspense
            fallback={
              <div class="route-loading">
                <div class="skeleton-bar is-lg" />
                <div class="skeleton-grid">
                  <div class="skeleton-bar" />
                  <div class="skeleton-bar" />
                  <div class="skeleton-bar" />
                  <div class="skeleton-bar" />
                </div>
                <div class="skeleton-bar" />
                <div class="skeleton-bar" />
              </div>
            }
          >
            {props.children}
          </Suspense>
        </div>
      </main>
    </div>
  )
}

export function App(props: { url?: string }) {
  return (
    <Router base={routerBase} root={AppShell} url={props.url}>
      <Route path="/" component={HomePage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:projectId/checkpoints/:checkpointId" component={ProjectPage} />
      <Route path="/projects/:projectId" component={ProjectPage} />
      <Route path="/labs" component={LabsPage} />
      <Route path="/labs/:labId" component={LabPage} />
      <Route path="*404" component={NotFoundPage} />
    </Router>
  )
}
