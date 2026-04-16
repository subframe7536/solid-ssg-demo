import { A } from '@solidjs/router'
import type { RouteSectionProps } from '@solidjs/router'
import { For } from 'solid-js'

import { labs, projects } from '../demo-data'

export default function LabsPage(_props: RouteSectionProps) {
  return (
    <div class="page stack">
      <section class="hero-card" style={{ '--accent': labs[0].accent }}>
        <div class="hero-headline">
          <p class="eyebrow">Labs</p>
          <h2 class="page-title">
            Small experiments for route loading, branch content, and UI polish.
          </h2>
          <p>
            These pages stay intentionally focused. Each one points back to a related project route
            so the demo keeps a consistent information structure.
          </p>
        </div>
      </section>

      <div class="lab-grid">
        <For each={labs}>
          {(lab) => {
            const project = projects.find((item) => item.id === lab.linkedProjectId)

            return (
              <article class="lab-card" style={{ '--accent': lab.accent }}>
                <div class="lab-card__title">
                  <div class="lab-meta">
                    <p class="eyebrow">{project?.name ?? lab.linkedProjectId}</p>
                    <span class="status-chip" data-tone="active">
                      lab route
                    </span>
                  </div>
                  <h3>{lab.title}</h3>
                  <p>{lab.summary}</p>
                </div>

                <ul class="bullet-list">
                  <For each={lab.bullets}>{(bullet) => <li>{bullet}</li>}</For>
                </ul>

                <div class="action-row">
                  <A class="button" href={`/labs/${lab.id}`}>
                    Open lab route
                  </A>
                  <A class="ghost-button" href={`/projects/${lab.linkedProjectId}`}>
                    Related project
                  </A>
                </div>
              </article>
            )
          }}
        </For>
      </div>
    </div>
  )
}
