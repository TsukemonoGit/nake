import { Accessor, Show, createSignal } from "solid-js";
import Button from "./Button";
import { className } from "@/util";

interface CopyButtonProps {
  text: string | Accessor<string>;
  style?: any;
}

export default function CopyButton({ text, style }: CopyButtonProps) {
  const [copied, setCopied] = createSignal(false);

  const copiedIcon = (
    <svg
      class={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
    >
      <g
        class={className}
        fill="none"
        stroke="#FF7375"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path
          class={className}
          d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0M8 5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v0"
        />
        <path class={className} d="m9 14l2 2l4-5" />
      </g>
    </svg>
  );

  const copyIcon = (
    <svg
      class={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
    >
      <path
        class={className}
        fill="none"
        stroke="#FF7375"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0M8 5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v0"
      />
    </svg>
  );

  const copy = async () => {
    navigator.clipboard.writeText(typeof text === "string" ? text : text());
    setCopied(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setCopied(false);
        resolve();
      }, 2000);
    });
  };
  return (
    <div class={className} style={style}>
      <span
        class={className}
        style={{ "font-size": "smaller", "word-break": "break-all" }}
      >
        {typeof text === "string" ? text : text()}
      </span>
      <Button
        onClick={copy}
        class="copyButton"
        style={{
          "margin-left": "4px",
          padding: "0 2px ",
          "border-radius": "100%",

          "vertical-align": "middle",
        }}
      >
        <Show when={copied()} fallback={<>{copyIcon}</>}>
          <>{copiedIcon}</>
        </Show>
      </Button>
    </div>
  );
}
