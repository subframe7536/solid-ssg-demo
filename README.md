# Solid JS SSG Demo

This is a demo project showcasing the use of Solid JS with Static Site Generation (SSG).

Highly inspired by [OpenControl](https://github.com/anomalyco/opencontrol/blob/dev/app/web)

## Setup

Install dependencies:

```bash
bun i
```

Start the dev server:

```bash
bun run dev
```

Build the app:

```bash
bun run build
```

This runs a single Vite app build that emits both the SSR bundle and the client bundle,
then prerenders the static routes into `dist/client`.

Preview the production build:

```bash
bun run preview
```

For a GitHub Pages-style base path:

```bash
bun run build:page
bun run preview:page
```
