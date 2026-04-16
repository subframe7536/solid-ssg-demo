import { A } from '@solidjs/router'
import type { RouteSectionProps } from '@solidjs/router'
import { For } from 'solid-js'

import { projects } from '../demo-data'

export default function ProjectsPage(_props: RouteSectionProps) {
  return (
    <div class="page stack">
      <section class="hero-card" style={{ '--accent': projects[1].accent }}>
        <div class="hero-headline">
          <p class="eyebrow">Projects</p>
          <h2 class="page-title">
            Every project route is lazy loaded and driven by the same data source.
          </h2>
          <p>
            The list view keeps the context dense enough to be useful, while each project detail
            route and checkpoint route stay concrete so the SSG build can prerender them.
          </p>
        </div>
      </section>

      <div class="project-grid">
        <For each={projects}>
          {(project) => (
            <article class="project-card" style={{ '--accent': project.accent }}>
              <div class="project-card__title">
                <div class="project-meta">
                  <p class="eyebrow">{project.owner}</p>
                  <span class="status-chip" data-tone="active">
                    {project.phase}
                  </span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>

              <div class="metric-grid">
                <For each={project.metrics}>
                  {(metric) => (
                    <div class="metric-card">
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  )}
                </For>
              </div>

              <div class="chip-row">
                <For each={project.tags}>{(tag) => <span class="chip">{tag}</span>}</For>
              </div>

              <div class="action-row">
                <A class="button" href={project.routeHint}>
                  Open project route
                </A>
                <A
                  class="ghost-button"
                  href={`/projects/${project.id}/checkpoints/${project.checkpoints[0].id}`}
                >
                  First checkpoint
                </A>
              </div>
            </article>
          )}
        </For>
      </div>
    </div>
  )
}
