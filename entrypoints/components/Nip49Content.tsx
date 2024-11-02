import { createSignal, Show } from "solid-js";

import Content from "./Content";
import { bytesToHex } from "@noble/hashes/utils";
import { decrypt } from "nostr-tools/nip49";
import { nip19 } from "nostr-tools";
export default function Nip49Content({ content }: { content: string }) {
  const [inputPassward, setInputPassward] = createSignal("");
  const [hex, setHex] = createSignal("");
  const [uint8Array, setUint8Array] = createSignal<Uint8Array>();
  const [isError, setIsError] = createSignal(false);
  const resetData = () => {
    setIsError(false);
    setHex("");
    setUint8Array(undefined);
  };

  const handleClickOK = () => {
    resetData();

    try {
      const decoded: Uint8Array = decrypt(content, inputPassward());
      setUint8Array(decoded);
      setHex(bytesToHex(decoded));
    } catch (error) {
      //console.error("Encryption failed:", error);
      setIsError(true);
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          id="nakeInput"
          class="nake"
          style={{ border: "1px solid #8caeff" }}
          placeholder="password"
          type="password"
          value={inputPassward()}
          onInput={(e) => setInputPassward(e.currentTarget.value)} // 双方向バインディング
        />
        <button
          class="nake nakeHint"
          style={{
            height: "2em",
            width: "2.5em",
            display: "inline-flex",
            "justify-content": "center",
            "align-items": "center",
          }}
          onClick={handleClickOK}
        >
          OK
        </button>
      </div>
      <Show when={!isError()} fallback={<div>Encryption failed</div>}>
        <Show when={hex() !== ""}>
          <Content content={hex} title={"hex"} link={false} />
        </Show>
        <Show when={uint8Array() !== undefined}>
          <Content
            content={nip19.nsecEncode(uint8Array() as Uint8Array)}
            title={"nsec"}
            link={false}
          />
        </Show>
      </Show>
    </>
  );
}
