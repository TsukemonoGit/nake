import { nip19 } from "nostr-tools";
import Content from "./Content";
import { createMemo } from "solid-js";

export default function RelayContent({ content }: { content: string }) {
  const nrelay = createMemo(() => {
    try {
      return nip19.nrelayEncode(content);
    } catch (error) {
      return "failed to Encode";
    }
  });
  return (
    <>
      <Content content={nrelay} title="nrelay" />
    </>
  );
}
