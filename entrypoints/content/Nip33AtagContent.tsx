import { className, nip33Regex } from "@/util";
import { nip19 } from "nostr-tools";
import { Accessor, Show, createMemo } from "solid-js";
import CopyButton from "./CopyButton";

export default function Nip33AtagContent({ content }: { content: string }) {
  // const matches = content.match(nip33Regex);
  // console.log(matches);
  // if (!matches) {
  //   return;
  // }
  const naddr: Accessor<nip19.AddressPointer | undefined> = createMemo(() => {
    const matches = content.match(nip33Regex);
    if (matches) {
      return {
        kind: Number(matches[1]),
        pubkey: matches[2],
        identifier: matches[3],
      };
    } else {
      return;
    }
  });
  return (
    <>
      <div class={className} style={{ margin: "6px 0" }}>
        <span
          class={className}
          style={{ "font-weight": "bold", "font-size": "smaller" }}
        >
          [naddr]
        </span>
        <CopyButton
          text={
            naddr() !== undefined
              ? nip19.naddrEncode(naddr() as nip19.AddressPointer)
              : ""
          }
        />
      </div>
      <div class={className} style={{ margin: "6px 0" }}>
        <span
          class={className}
          style={{ "font-weight": "bold", "font-size": "smaller" }}
        >
          [identifier]
        </span>
        <CopyButton text={naddr()?.identifier ?? ""} />
      </div>
      <div class={className} style={{ margin: "6px 0" }}>
        <span
          class={className}
          style={{ "font-weight": "bold", "font-size": "smaller" }}
        >
          [kind]
        </span>
        <CopyButton text={naddr()?.kind?.toString() ?? ""} />
      </div>
      <div class={className} style={{ margin: "6px 0" }}>
        <span
          class={className}
          style={{ "font-weight": "bold", "font-size": "smaller" }}
        >
          [pubkey]
        </span>
        <CopyButton text={naddr()?.pubkey ?? ""} />
      </div>

      <Show when={naddr()?.relays}>
        <div class={className} style={{ margin: "6px 0" }}>
          <span
            class={className}
            style={{ "font-weight": "bold", "font-size": "smaller" }}
          >
            [relays]
          </span>
          <CopyButton text={naddr()?.relays?.join(", ") || "no data"} />
        </div>
      </Show>
      <div class={className} style={{ margin: "6px 0" }}>
        <span
          class={className}
          style={{ "font-weight": "bold", "font-size": "smaller" }}
        >
          ['a' tag]
        </span>
        <CopyButton
          text={`${naddr()?.kind.toString()}:${naddr()?.pubkey}:${
            naddr()?.identifier
          }`}
        />
      </div>
    </>
  );
}
