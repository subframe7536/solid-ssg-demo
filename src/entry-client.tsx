/* @refresh reload */

import { hydrate, render } from 'solid-js/web'
import { FileRouter } from 'virtual:routes'

import { routerBase } from './base-path'

const mount = document.getElementById('root')!
const view = () => <FileRouter base={routerBase} />

if (import.meta.env.DEV) {
  render(view, mount)
} else if ('_$HY' in window) {
  hydrate(view, mount)
} else {
  render(view, mount)
}
