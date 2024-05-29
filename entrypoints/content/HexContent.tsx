import { nip19 } from "nostr-tools";
import { createMemo } from "solid-js";
import { className } from "../../util";

import CopyButton from "./CopyButton";
export default function HecContent({ content }: { content: string }) {
  const nevent = createMemo(() => {
    try {
      return nip19.neventEncode({ id: content });
    } catch (error) {
      return "";
    }
  });

  const note = createMemo(() => {
    try {
      return nip19.noteEncode(content);
    } catch (error) {
      return "";
    }
  });
  const nprofile = createMemo(() => {
    try {
      return nip19.nprofileEncode({ pubkey: content });
    } catch (error) {
      return "";
    }
  });
  const npub = createMemo(() => {
    try {
      return nip19.npubEncode(content);
    } catch (error) {
      return "";
    }
  });

  return (
    <>
      if this is a public key:
      <CopyButton text={npub()} />
      <CopyButton text={nprofile()} />
      <hr />
      if this is a private key:
      あとでやる（nsecなtextからpubだしたりnprofileにしたりする）
      <hr />
      if this is an event id:
      <CopyButton text={note()} />
      <CopyButton text={nevent()} />
    </>
  );
}
