import { className } from "@/util";
import CopyButton from "./CopyButton";
import { Accessor, Show } from "solid-js";

export default function Content({
  content,
  title,
}: {
  content: Accessor<string> | string;
  title?: string;
}) {
  return (
    <div class={className} style={{ margin: "6px 0" }}>
      <Show when={title}>
        <span
          class={className}
          style={{ "font-weight": "bold", "font-size": "smaller" }}
        >
          [{title}]
        </span>
      </Show>
      <CopyButton text={content} />
    </div>
  );
}
