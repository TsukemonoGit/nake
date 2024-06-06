import { Accessor, Show, createMemo, createSignal } from "solid-js";
import Button from "./Button";
import { className } from "@/util";
import Link from "./Link";

interface CopyButtonProps {
  text: string | Accessor<string>;
  style?: any;
  link?: boolean;
}

export default function CopyButton({
  text,
  style,
  link = true,
}: CopyButtonProps) {
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
  const href = createMemo(() => {
    if (text) {
      if (typeof text === "string") {
        return text;
      } else {
        return text();
      }
    }
  });

  return (
    <div class={className} style={style}>
      <span
        class={className}
        style={{ "font-size": "smaller", "word-break": "break-all" }}
      >
        {typeof text === "string" ? text : text()}
      </span>
      <Button
        title={"copy to clipboard"}
        onClick={copy}
        class="nakeCopyButton"
        style={{
          "margin-left": "4px",
          padding: "2px ",
          "border-radius": "100%",
          display: "inline-flex",
          "vertical-align": "middle",
        }}
      >
        <Show when={copied()} fallback={<>{copyIcon}</>}>
          <>{copiedIcon}</>
        </Show>
      </Button>
      <Show when={link === true}>
        <Link
          title={"open in njump"}
          href={`https://njump.me/${href}`}
          class={className + " nakeLinkButton"}
          style={{
            height: "fit-content",
            width: "fit-content",

            padding: "2px ",
            "border-radius": "100%",
            display: "inline-flex",
            "vertical-align": "middle",
          }}
        >
          <svg
            class={className}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="#FF7375"
              d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h14v-6q0-.425.288-.712T20 12t.713.288T21 13v6q0 .825-.587 1.413T19 21zM19 6.4L10.4 15q-.275.275-.7.275T9 15t-.275-.7t.275-.7L17.6 5H15q-.425 0-.712-.288T14 4t.288-.712T15 3h5q.425 0 .713.288T21 4v5q0 .425-.288.713T20 10t-.712-.288T19 9z"
            />
          </svg>
        </Link>
      </Show>
    </div>
  );
}
