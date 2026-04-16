import { createSignal } from "solid-js";

export function App(props: { url?: string }) {
  const [cnt, setCnt] = createSignal(1);
  return (
    <div>
      {props.url}
      <div>{cnt()}</div>
      <button onClick={() => setCnt((c) => ++c)}>test</button>
    </div>
  );
}
