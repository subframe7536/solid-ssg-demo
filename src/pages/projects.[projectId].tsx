import { A, useParams } from '@solidjs/router'
import { createRoute } from 'solid-file-router'
import { createMemo, For, Show } from 'solid-js'

import { withBasePath } from '../base-path'
import { getCheckpoint, getProject, projects } from '../demo-data'

export type ProjectViewProps = {
  projectId: string
  checkpointId?: string
}

export function ProjectView(props: ProjectViewProps) {
  const project = createMemo(() => getProject(props.projectId))
  const checkpoint = createMemo(() =>
    props.checkpointId ? getCheckpoint(props.projectId, props.checkpointId) : undefined,
  )

  return (
    <div class="page">
      <Show
        when={project()}
        fallback={
          <section class="empty-state" style={`--accent: ${projects[0].accent}`}>
            <p class="eyebrow">Missing route</p>
            <h2 class="page-title">That project route does not exist.</h2>
            <p>The URL did not match one of the generated project branches.</p>
            <div class="empty-state__actions">
              <A class="button" href={withBasePath('/projects')}>
                Back to projects
              </A>
              <A class="ghost-button" end href={withBasePath('/')}>
                Go home
              </A>
            </div>
          </section>
        }
      >
        {(currentProject) => (
          <>
            <section class="detail-panel" style={`--accent: ${currentProject().accent}`}>
              <div class="breadcrumb">
                <A end href={withBasePath('/')}>
                  Home
                </A>
                <span>/</span>
                <A href={withBasePath('/projects')}>Projects</A>
                <span>/</span>
                <span>{currentProject().name}</span>
                <Show when={props.checkpointId}>
                  <>
                    <span>/</span>
                    <span>{props.checkpointId}</span>
                  </>
                </Show>
              </div>

              <div class="detail-meta">
                <div class="stack">
                  <p class="eyebrow">{currentProject().owner}</p>
                  <h2 class="detail-title">
                    {checkpoint() ? checkpoint()!.title : currentProject()!.name}
                  </h2>
                </div>
                <span
                  class="status-chip"
                  data-tone={checkpoint() ? checkpoint()!.status : 'active'}
                >
                  {checkpoint() ? checkpoint()!.status : currentProject()!.phase}
                </span>
              </div>

              <p>{checkpoint() ? checkpoint()!.summary : currentProject()!.summary}</p>

              <div class="chip-row">
                <For each={currentProject().tags}>{(tag) => <span class="chip">{tag}</span>}</For>
              </div>

              <div class="action-row">
                <A class="button" href={withBasePath(currentProject().routeHint)}>
                  Project overview
                </A>
                <A class="ghost-button" href={withBasePath('/projects')}>
                  All projects
                </A>
              </div>
            </section>

            <Show
              when={checkpoint()}
              fallback={
                <div class="detail-grid">
                  <section class="detail-panel" style={`--accent: ${currentProject().accent}`}>
                    <div class="section-header">
                      <h2>Route metrics</h2>
                      <span class="status-chip" data-tone="done">
                        {currentProject().checkpoints.length} checkpoints
                      </span>
                    </div>
                    <div class="metric-grid">
                      <For each={currentProject().metrics}>
                        {(metric) => (
                          <div class="metric-card">
                            <span>{metric.label}</span>
                            <strong>{metric.value}</strong>
                          </div>
                        )}
                      </For>
                    </div>
                  </section>

                  <section class="detail-panel" style={`--accent: ${currentProject().accent}`}>
                    <div class="section-header">
                      <h2>Checkpoint routes</h2>
                      <span class="status-chip" data-tone="active">
                        {currentProject().routeHint}
                      </span>
                    </div>
                    <div class="checkpoint-list">
                      <For each={currentProject().checkpoints}>
                        {(item) => (
                          <article class="checkpoint-card">
                            <div class="section-header">
                              <strong>{item.title}</strong>
                              <span class="status-chip" data-tone={item.status}>
                                {item.eta}
                              </span>
                            </div>
                            <p>{item.summary}</p>
                            <A
                              class="card-link"
                              href={withBasePath(
                                `/projects/${currentProject().id}/checkpoints/${item.id}`,
                              )}
                            >
                              Open checkpoint route
                            </A>
                          </article>
                        )}
                      </For>
                    </div>
                  </section>
                </div>
              }
            >
              {(currentCheckpoint) => (
                <>
                  <section class="detail-grid">
                    <article class="detail-panel" style={`--accent: ${currentProject().accent}`}>
                      <div class="section-header">
                        <h2>Checkpoint detail</h2>
                        <span class="status-chip" data-tone={currentCheckpoint().status}>
                          {currentCheckpoint().eta}
                        </span>
                      </div>
                      <p>{currentCheckpoint().summary}</p>
                      <ul class="bullet-list">
                        <For each={currentCheckpoint().bullets}>
                          {(bullet) => <li>{bullet}</li>}
                        </For>
                      </ul>
                    </article>

                    <article class="detail-panel" style={`--accent: ${currentProject().accent}`}>
                      <div class="section-header">
                        <h2>Project checkpoints</h2>
                        <span class="status-chip" data-tone="active">
                          {currentProject().id}
                        </span>
                      </div>
                      <div class="checkpoint-list">
                        <For each={currentProject().checkpoints}>
                          {(item) => (
                            <article class="checkpoint-card">
                              <div class="section-header">
                                <strong>{item.title}</strong>
                                <span class="status-chip" data-tone={item.status}>
                                  {item.status}
                                </span>
                              </div>
                              <p>{item.summary}</p>
                              <A
                                class="card-link"
                                href={withBasePath(
                                  `/projects/${currentProject().id}/checkpoints/${item.id}`,
                                )}
                              >
                                Open checkpoint route
                              </A>
                            </article>
                          )}
                        </For>
                      </div>
                    </article>
                  </section>

                  <section class="detail-panel" style={`--accent: ${currentProject().accent}`}>
                    <div class="section-header">
                      <h2>Other project routes</h2>
                      <A class="card-link" href={withBasePath('/projects')}>
                        Back to the index
                      </A>
                    </div>
                    <div class="project-grid">
                      <For each={projects.filter((item) => item.id !== currentProject().id)}>
                        {(otherProject) => (
                          <article class="project-card" style={`--accent: ${otherProject.accent}`}>
                            <div class="project-card__title">
                              <div class="project-meta">
                                <p class="eyebrow">{otherProject.owner}</p>
                                <span class="status-chip" data-tone="queued">
                                  {otherProject.phase}
                                </span>
                              </div>
                              <h3>{otherProject.name}</h3>
                              <p>{otherProject.summary}</p>
                            </div>
                            <A class="card-link" href={withBasePath(otherProject.routeHint)}>
                              Open route
                            </A>
                          </article>
                        )}
                      </For>
                    </div>
                  </section>
                </>
              )}
            </Show>
          </>
        )}
      </Show>
    </div>
  )
}

export default createRoute({
  component: () => {
    const params = useParams<{ projectId: string }>()

    return <ProjectView projectId={params.projectId ?? ''} />
  },
})
