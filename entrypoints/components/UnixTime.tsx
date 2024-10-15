import { createMemo } from "solid-js";
import { className } from "../../util";

import CopyButton from "./CopyButton";
export default function UnixTime({ content }: { content: string }) {
  const localTime = new Date(Number(content) * 1000).toLocaleString();
  return (
    <div class={className} style={{ "margin-top": "0.5em" }}>
      <span class={className} style={{ color: "gray", "font-size": "small" }}>
        local time
      </span>
      <CopyButton text={localTime} style={{ margin: "0.5em 0" }} />
    </div>
  );
}
