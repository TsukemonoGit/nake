import { className, relayRegex } from "@/util";
import { Accessor, For, Setter, Show, createSignal } from "solid-js";

export default function RelayHints({
  setRelayHints,
  relayHints,
}: {
  setRelayHints: Setter<string[]>;
  relayHints: Accessor<string[]>;
}) {
  const [inputRelayHint, setInputRelayHint] = createSignal("");
  const [invalid, setInvalid] = createSignal(false);
  //let relayInputClass = "relayInput";
  const handleClickAdd = async () => {
    if (!relayRegex.test(inputRelayHint().trim())) {
      setInvalid(true);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setInvalid(false);
          resolve();
        }, 1000);
      });
    } else {
      setRelayHints([...relayHints(), inputRelayHint().trim()]);
      setInputRelayHint("");
    }
  };
  const handleClickDelete = (index: number) => {
    const newRelayHints = [...relayHints()];
    newRelayHints.splice(index, 1);
    setRelayHints(newRelayHints);
    // setRelayHints(relayHints().filter((_, i) => i !== index));
  };
  return (
    <>
      [relay hints]
      <Show when={relayHints().length > 0}>
        <div
          class={`${className} `}
          style={{ display: "flex", "flex-wrap": "wrap" }}
        >
          <For each={relayHints()}>
            {(item, index) => (
              <div class={`${className} relay`}>
                {item}
                <button
                  class={`${className}`}
                  style={{ padding: "0 4px" }}
                  onClick={() => handleClickDelete(index())}
                >
                  ✕
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>
      <input
        class={`${className} ${invalid() ? "invalidInput" : "relayInput"}`}
        placeholder="wss://"
        type="text"
        value={inputRelayHint()}
        onInput={(e) => setInputRelayHint(e.currentTarget.value)}
      ></input>
      <button class={`${className} hint`} onclick={handleClickAdd}>
        add relay hint
      </button>
    </>
  );
}

{
  /* <Show when={(decoded()?.data as nip19.ProfilePointer)?.relays}>
                <div class={className} style={{ margin: "6px 0" }}>
                  <span
                    class={className}
                    style={{ "font-weight": "bold", "font-size": "smaller" }}
                  >
                    [relays]
                  </span>
                  <CopyButton
                    text={
                      (decoded()?.data as nip19.ProfilePointer)?.relays?.join(
                        ", "
                      ) || "no data"
                    }
                  />
                </div>
              </Show> */
}
