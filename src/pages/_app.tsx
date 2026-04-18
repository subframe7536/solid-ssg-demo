import '../styles.css'

import { A, useLocation } from '@solidjs/router'
import { createRoute } from 'solid-file-router'
import type { ParentComponent } from 'solid-js'
import { For, Suspense } from 'solid-js'

import { stripBasePath, withBasePath } from '../base-path'
import { getPrerenderPaths, labs, projects } from '../demo-data'

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

const AppShell: ParentComponent = (props) => {
  const location = useLocation()
  const currentPath = () => `${stripBasePath(location.pathname)}${location.search}`
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
              <A class="nav-link" end={item.href === '/'} href={withBasePath(item.href)}>
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
              The shell stays mounted while solid-file-router swaps lazy-loaded route modules in and
              out of the outlet.
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

export default createRoute({
  component: AppShell,
})
