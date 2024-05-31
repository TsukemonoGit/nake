import { nip19 } from "nostr-tools";
import Content from "./Content";

export default function RelayContent({ content }: { content: string }) {
  return (
    <>
      <Content content={nip19.nrelayEncode(content)} title="nrelay" />{" "}
    </>
  );
}
