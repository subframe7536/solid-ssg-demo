import { renderToStringAsync } from 'solid-js/web'

import { App } from './app'

export default async function (props: { url: string }) {
  return await renderToStringAsync(() => <App url={props.url} />)
}
