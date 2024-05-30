import { className, nip33Regex } from "@/util";
import { nip19 } from "nostr-tools";
import { Accessor, Show, createMemo, createSignal } from "solid-js";
import CopyButton from "./CopyButton";
import Content from "./Content";
import RelayHints from "./RelayHints";

export default function Nip33AtagContent({ content }: { content: string }) {
  const [relayHints, setRelayHints] = createSignal<string[]>([]);
  const naddr: Accessor<nip19.AddressPointer | undefined> = createMemo(() => {
    const matches = content.match(nip33Regex);
    if (matches) {
      return {
        kind: Number(matches[1]),
        pubkey: matches[2],
        identifier: matches[3],
        relays: relayHints(),
      };
    } else {
      return;
    }
  });
  const encodedNaddr: Accessor<string> | string = createMemo(() => {
    if (naddr() !== undefined) {
      return nip19.naddrEncode(naddr() as nip19.AddressPointer);
    } else {
      return "";
    }
  });
  return (
    <>
      <Content content={naddr()?.identifier ?? ""} title={"identifier"} />
      <Content content={naddr()?.kind?.toString() ?? ""} title={"kind"} />
      <Content content={naddr()?.pubkey ?? ""} title={"pubkey"} />
      <Content
        content={`${naddr()?.kind.toString()}:${naddr()?.pubkey}:${
          naddr()?.identifier
        }`}
        title={"'a' tag"}
      />{" "}
      <RelayHints setRelayHints={setRelayHints} relayHints={relayHints} />
      <hr />
      <Content content={encodedNaddr} title={"naddr"} />
    </>
  );
}
