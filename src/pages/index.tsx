import { A } from '@solidjs/router'
import { createRoute } from 'solid-file-router'
import { For } from 'solid-js'

import { withBasePath } from '../base-path'
import { labs, projects } from '../demo-data'

function HomeView() {
  const featuredRoutes = [
    ...projects.map((project) => ({
      href: `/projects/${project.id}`,
      title: project.name,
      note: project.routeHint,
      accent: project.accent,
    })),
    ...labs.map((lab) => ({
      href: `/labs/${lab.id}`,
      title: lab.title,
      note: `Lab route · ${lab.linkedProjectId}`,
      accent: lab.accent,
    })),
  ]

  return (
    <div class="page-stack">
      <section class="hero-card" style={`--accent: ${projects[0].accent}`}>
        <div class="hero-headline">
          <p class="eyebrow">Solid file router demo</p>
          <h2 class="page-title">
            Lazy-loaded route modules with dynamic paths and prerendered pages.
          </h2>
          <p>
            This demo keeps the shell stable, splits pages into route chunks, and drives detail
            views from shared content so the server build can prerender concrete URLs.
          </p>
        </div>

        <div class="action-row">
          <A class="button" href={withBasePath('/projects')}>
            Explore projects
          </A>
          <A class="ghost-button" href={withBasePath('/labs/routing')}>
            Open the routing lab
          </A>
        </div>
      </section>

      <section class="panel-grid">
        <article class="panel-card" style={`--accent: ${projects[1].accent}`}>
          <div class="section-header">
            <div>
              <p class="eyebrow">Overview</p>
              <h2>What this app proves</h2>
            </div>
            <span class="status-chip" data-tone="active">
              7 prerendered paths
            </span>
          </div>
          <div class="metric-grid" style={`--accent: ${projects[1].accent}`}>
            <div class="metric-card">
              <span>Projects</span>
              <strong>{projects.length}</strong>
            </div>
            <div class="metric-card">
              <span>Checkpoint routes</span>
              <strong>
                {projects.reduce((count, project) => count + project.checkpoints.length, 0)}
              </strong>
            </div>
            <div class="metric-card">
              <span>Lab routes</span>
              <strong>{labs.length}</strong>
            </div>
          </div>
        </article>

        <article class="panel-card" style={`--accent: ${labs[0].accent}`}>
          <div class="section-header">
            <div>
              <p class="eyebrow">Route map</p>
              <h2>Featured deep links</h2>
            </div>
            <span class="status-chip" data-tone="queued">
              lazy() imports
            </span>
          </div>
          <div class="route-list">
            <For each={featuredRoutes.slice(0, 5)}>
              {(route) => (
                <A
                  class="route-item"
                  href={withBasePath(route.href)}
                  style={`--accent: ${route.accent}`}
                >
                  <strong>{route.title}</strong>
                  <span>{route.note}</span>
                </A>
              )}
            </For>
          </div>
        </article>
      </section>

      <section class="panel-card" style={`--accent: ${projects[2].accent}`}>
        <div class="section-header">
          <div>
            <p class="eyebrow">How it is structured</p>
            <h2>Route groups</h2>
          </div>
          <A class="card-link" href={withBasePath('/projects')}>
            Browse every project
          </A>
        </div>

        <div class="project-grid">
          <For each={projects}>
            {(project) => (
              <article class="project-card" style={`--accent: ${project.accent}`}>
                <div class="project-card__title">
                  <div class="project-meta">
                    <p class="eyebrow">{project.phase}</p>
                    <span class="status-chip" data-tone="active">
                      {project.routeHint}
                    </span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                </div>

                <div class="chip-row">
                  <For each={project.tags}>{(tag) => <span class="chip">{tag}</span>}</For>
                </div>

                <A class="card-link" href={withBasePath(project.routeHint)}>
                  Open detail route
                </A>
              </article>
            )}
          </For>
        </div>
      </section>
    </div>
  )
}

export default createRoute({
  component: HomeView,
})
