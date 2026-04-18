import { A } from '@solidjs/router'
import { createRoute } from 'solid-file-router'

import { withBasePath } from '../base-path'

function NotFoundView() {
  return (
    <section class="empty-state" style="--accent: #7cc6ff">
      <p class="eyebrow">404</p>
      <h2 class="page-title">The route you asked for does not exist.</h2>
      <p>
        Use the shell navigation to jump back into the demo, or open one of the pre-rendered project
        and lab routes.
      </p>
      <div class="empty-state__actions">
        <A class="button" end href={withBasePath('/')}>
          Go home
        </A>
        <A class="ghost-button" href={withBasePath('/projects')}>
          Browse projects
        </A>
      </div>
    </section>
  )
}

export default createRoute({
  component: NotFoundView,
})
