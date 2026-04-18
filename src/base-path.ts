const viteBase = import.meta.env.BASE_URL
const normalizedBase = viteBase === '/' ? '' : viteBase.replace(/\/$/, '')

export const routerBase = viteBase
export const appBasePath = normalizedBase

export function stripBasePath(pathname: string) {
  if (!normalizedBase || !pathname.startsWith(normalizedBase)) {
    return pathname
  }

  const stripped = pathname.slice(normalizedBase.length)
  return stripped || '/'
}

export function withBasePath(path: string) {
  if (!normalizedBase) {
    return path
  }

  if (path.startsWith(normalizedBase)) {
    return path
  }

  if (path === '/') {
    return `${normalizedBase}/`
  }

  return `${normalizedBase}${path.startsWith('/') ? path : `/${path}`}`
}
