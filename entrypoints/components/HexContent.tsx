import { getPublicKey, nip19 } from "nostr-tools";
import { createMemo } from "solid-js";
import { className } from "../../utils/util";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
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
  const nsec = createMemo(() => {
    try {
      return nip19.nsecEncode(hexToBytes(content));
    } catch (error) {
      return "";
    }
  });
  const nsecNpub = createMemo(() => {
    try {
      return nip19.npubEncode(getPublicKey(hexToBytes(content)));
    } catch (error) {
      return "";
    }
  });
  const nsecNprofile = createMemo(() => {
    try {
      return nip19.nprofileEncode({
        pubkey: getPublicKey(hexToBytes(content)),
      });
    } catch (error) {
      return "";
    }
  });
  return (
    <div class={className} style={{ "margin-top": "0.5em" }}>
      <span class={className} style={{ color: "gray", "font-size": "small" }}>
        if this is a public key:
      </span>
      <CopyButton text={npub()} style={{ margin: "0.5em 0" }} />
      <CopyButton text={nprofile()} style={{ margin: "0.5em 0" }} />
      <hr style={{ margin: "0.5em 0" }} />
      <span class={className} style={{ color: "gray", "font-size": "small" }}>
        if this is a private key:
      </span>
      <CopyButton text={nsec()} style={{ margin: "0.5em 0" }} link={false} />
      <CopyButton text={nsecNpub()} style={{ margin: "0.5em 0" }} />
      <CopyButton text={nsecNprofile()} style={{ margin: "0.5em 0" }} />
      <hr style={{ margin: "0.5em 0" }} />
      <span class={className} style={{ color: "gray", "font-size": "small" }}>
        if this is an event id:
      </span>
      <CopyButton text={note()} style={{ margin: "0.5em 0" }} />
      <CopyButton text={nevent()} style={{ margin: "0.5em 0" }} />
    </div>
  );
}
