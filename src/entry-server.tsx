import { renderToStringAsync } from 'solid-js/web'
import { FileRouter } from 'virtual:routes'

import { routerBase } from './base-path'

export default async function (props: { url: string }) {
  return await renderToStringAsync(() => <FileRouter base={routerBase} url={props.url} />)
}
