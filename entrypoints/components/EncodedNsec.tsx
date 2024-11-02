import { nsecToNpub, toNcryptsec } from "@/util";
import Content from "./Content";
import { bytesToHex } from "@noble/hashes/utils";
import { createSignal, Show } from "solid-js";

export default function EncodedNsec({ array }: { array: Uint8Array }) {
  const [inputPassward, setInputPassward] = createSignal("");
  const [ncryptsec, setNcryptsec] = createSignal("");

  const handleClickPassward = () => {
    const encrypted = toNcryptsec(array, inputPassward());
    console.log(encrypted);
    setNcryptsec(encrypted); // ここでエンコード結果を設定
  };

  return (
    <>
      <Content content={array.toString()} title={"Uint8Array"} link={false} />
      <Content content={bytesToHex(array)} title={"hex"} link={false} />
      <hr />
      Private Key Encryption
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
          padding: " 0 8px",
          "margin-left": "4px",
          "line-height": "normal",
        }}
        onClick={handleClickPassward}
      >
        OK
      </button>
      <Show when={ncryptsec() !== ""}>
        <Content content={ncryptsec} title={"ncryptsec"} link={false} />
      </Show>
      <hr style={{ margin: "0.5em 0" }} />
      <Content content={nsecToNpub(array)} title={"npub"} link={false} />
    </>
  );
}
