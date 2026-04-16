export type Checkpoint = {
  id: string
  title: string
  summary: string
  status: 'done' | 'active' | 'queued'
  eta: string
  bullets: string[]
}

export type Project = {
  id: string
  name: string
  summary: string
  owner: string
  phase: string
  routeHint: string
  accent: string
  metrics: { label: string; value: string }[]
  tags: string[]
  checkpoints: Checkpoint[]
}

export type Lab = {
  id: string
  title: string
  summary: string
  accent: string
  linkedProjectId: string
  bullets: string[]
}

export const projects: Project[] = [
  {
    id: 'aurora',
    name: 'Aurora Stream',
    summary:
      'A streaming demo where the layout renders immediately, while route chunks and dynamic branches load in the background.',
    owner: 'Platform',
    phase: 'shipping',
    routeHint: '/projects/aurora',
    accent: '#67d7c2',
    metrics: [
      { label: 'Shell paint', value: '118ms' },
      { label: 'Lazy routes', value: '3 chunks' },
      { label: 'Dynamic paths', value: '4' },
    ],
    tags: ['SSR', 'lazy()', 'checkpoint routes'],
    checkpoints: [
      {
        id: 'shell',
        title: 'Ship the shell first',
        summary: 'The app frame stays visible while the router resolves the branch below it.',
        status: 'done',
        eta: 'today',
        bullets: [
          'Keep navigation inside the root layout.',
          'Render the route outlet inside Suspense.',
          'Avoid blocking the initial HTML response.',
        ],
      },
      {
        id: 'prefetch',
        title: 'Warm the next branch',
        summary: 'Hovered links hint at the next chunk so navigation feels instant.',
        status: 'active',
        eta: 'this week',
        bullets: [
          'Preload the most likely checkpoint pages.',
          'Keep link targets stable across refreshes.',
          'Use data from the same source on server and client.',
        ],
      },
      {
        id: 'settle',
        title: 'Let the router settle',
        summary: 'Every branch gets a durable path so refreshes land on the same state.',
        status: 'queued',
        eta: 'next',
        bullets: [
          'Prerender concrete paths from shared content.',
          'Match both project and checkpoint segments.',
          'Keep the client tree aligned with the server tree.',
        ],
      },
    ],
  },
  {
    id: 'atlas',
    name: 'Atlas Console',
    summary:
      'A route-heavy ops dashboard that shows how dynamic params can drive a dense navigation model without turning the UI into a maze.',
    owner: 'Infra',
    phase: 'beta',
    routeHint: '/projects/atlas',
    accent: '#f7c873',
    metrics: [
      { label: 'Route depth', value: '2 levels' },
      { label: 'Branch cards', value: '9' },
      { label: 'Pre-rendered URLs', value: '7' },
    ],
    tags: ['dynamic params', 'nested routes', 'SSG'],
    checkpoints: [
      {
        id: 'index',
        title: 'Keep the index readable',
        summary:
          'The list view gives enough context that you do not need to open every detail page.',
        status: 'done',
        eta: 'now',
        bullets: [
          'Expose the route hint directly in each card.',
          'Show the owning team and phase up front.',
          'Use a single hierarchy for all list pages.',
        ],
      },
      {
        id: 'detail',
        title: 'Make details specific',
        summary: 'The project page should answer what this branch does and why it exists.',
        status: 'active',
        eta: 'soon',
        bullets: [
          'Keep checkpoint labels descriptive.',
          'Prefer route-aware breadcrumbs over breadcrumbs that are purely visual.',
          'Let each route expose a focused next action.',
        ],
      },
      {
        id: 'branches',
        title: 'Map the branch tree',
        summary:
          'The dynamic segments stay small enough that the URL itself reads like a control surface.',
        status: 'queued',
        eta: 'later',
        bullets: [
          'Prerender every concrete branch that matters.',
          'Keep the parent route stable across nested pages.',
          'Use route params instead of extra query state where possible.',
        ],
      },
    ],
  },
  {
    id: 'helix',
    name: 'Helix Studio',
    summary:
      'A polished experimentation area for route transitions, page framing, and the small details that make a demo feel deliberate.',
    owner: 'Design',
    phase: 'experiment',
    routeHint: '/projects/helix',
    accent: '#ff8f9f',
    metrics: [
      { label: 'Card motion', value: '160ms' },
      { label: 'Accent tone', value: 'warm' },
      { label: 'Focus paths', value: '5' },
    ],
    tags: ['UI polish', 'responsive', 'route states'],
    checkpoints: [
      {
        id: 'frame',
        title: 'Shape the frame',
        summary: 'Use the shell to establish rhythm before the content moves.',
        status: 'done',
        eta: 'today',
        bullets: [
          'Keep the workspace width readable on desktop.',
          'Collapse gracefully on smaller screens.',
          'Reserve room for route context and actions.',
        ],
      },
      {
        id: 'motion',
        title: 'Keep motion functional',
        summary:
          'The only animations are there to clarify state changes or loading, not to decorate empty space.',
        status: 'active',
        eta: 'this sprint',
        bullets: [
          'Limit transitions to specific properties.',
          'Use short durations for controls and navigation.',
          'Start from visible states instead of scale(0).',
        ],
      },
      {
        id: 'finish',
        title: 'Finish with restraint',
        summary:
          'The last pass tightens spacing, contrast, and active states so the demo feels finished.',
        status: 'queued',
        eta: 'next',
        bullets: [
          'Keep the tone consistent across all route views.',
          'Make active links obvious without shouting.',
          'Stay within the same visual language across pages.',
        ],
      },
    ],
  },
]

export const labs: Lab[] = [
  {
    id: 'routing',
    title: 'Routing Lab',
    summary: 'A route map for checking nested params, lazy chunks, and concrete prerender paths.',
    accent: '#7cc6ff',
    linkedProjectId: 'atlas',
    bullets: [
      'Nested route segments stay simple enough to prerender.',
      'The same content powers the index page and the detail pages.',
      'Lazy-loaded route modules still hydrate cleanly.',
    ],
  },
  {
    id: 'streaming',
    title: 'Streaming Lab',
    summary: 'A lightweight way to inspect how the shell renders before the route branch resolves.',
    accent: '#67d7c2',
    linkedProjectId: 'aurora',
    bullets: [
      'The shell does not wait for the inner chunk to finish loading.',
      'Loading state should be quiet and specific.',
      'The server and client both use the same route table.',
    ],
  },
  {
    id: 'polish',
    title: 'Polish Lab',
    summary:
      'A place to check the surface details: spacing, hover states, and active link feedback.',
    accent: '#ff8f9f',
    linkedProjectId: 'helix',
    bullets: [
      'Controls should respond on the first frame.',
      'The layout should remain balanced when a page gets longer.',
      'Card and link states should feel intentional, not generic.',
    ],
  },
]

export function getProject(projectId: string) {
  return projects.find((project) => project.id === projectId)
}

export function getCheckpoint(projectId: string, checkpointId: string) {
  return getProject(projectId)?.checkpoints.find((checkpoint) => checkpoint.id === checkpointId)
}

export function getLab(labId: string) {
  return labs.find((lab) => lab.id === labId)
}

export function getPrerenderPaths() {
  return [
    '/',
    '/projects',
    '/labs',
    // oxlint-disable-next-line oxc/no-map-spread
    ...projects.flatMap((project) => [
      `/projects/${project.id}`,
      ...project.checkpoints.map(
        (checkpoint) => `/projects/${project.id}/checkpoints/${checkpoint.id}`,
      ),
    ]),
    ...labs.map((lab) => `/labs/${lab.id}`),
  ]
}
