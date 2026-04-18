import { A, useParams } from '@solidjs/router'
import { createRoute } from 'solid-file-router'
import { For, Show } from 'solid-js'

import { withBasePath } from '../base-path'
import { getLab, getProject, projects } from '../demo-data'

function LabView(props: { labId: string }) {
  const lab = () => getLab(props.labId)
  const linkedProject = () => (lab() ? getProject(lab()!.linkedProjectId) : undefined)

  return (
    <div class="page">
      <Show
        when={lab()}
        fallback={
          <section class="empty-state" style={`--accent: ${projects[0].accent}`}>
            <p class="eyebrow">Missing route</p>
            <h2 class="page-title">That lab route does not exist.</h2>
            <p>The URL did not match one of the generated lab pages.</p>
            <div class="empty-state__actions">
              <A class="button" href={withBasePath('/labs')}>
                Back to labs
              </A>
              <A class="ghost-button" end href={withBasePath('/')}>
                Go home
              </A>
            </div>
          </section>
        }
      >
        {(currentLab) => (
          <section class="detail-panel" style={`--accent: ${currentLab().accent}`}>
            <div class="breadcrumb">
              <A end href={withBasePath('/')}>
                Home
              </A>
              <span>/</span>
              <A href={withBasePath('/labs')}>Labs</A>
              <span>/</span>
              <span>{currentLab().title}</span>
            </div>

            <div class="detail-meta">
              <div class="stack">
                <p class="eyebrow">{linkedProject()?.name ?? currentLab().linkedProjectId}</p>
                <h2 class="detail-title">{currentLab().title}</h2>
              </div>
              <span class="status-chip" data-tone="active">
                dynamic route
              </span>
            </div>

            <p>{currentLab().summary}</p>

            <ul class="bullet-list">
              <For each={currentLab().bullets}>{(bullet) => <li>{bullet}</li>}</For>
            </ul>

            <div class="action-row">
              <A class="button" href={withBasePath(`/projects/${currentLab().linkedProjectId}`)}>
                Related project
              </A>
              <A class="ghost-button" href={withBasePath('/labs')}>
                All labs
              </A>
            </div>
          </section>
        )}
      </Show>
    </div>
  )
}

export default createRoute({
  component: () => {
    const params = useParams<{ labId: string }>()

    return <LabView labId={params.labId ?? ''} />
  },
})
