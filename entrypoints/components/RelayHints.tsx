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
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClickAdd();
    }
  };

  return (
    <>
      <span
        class={className}
        style={{ "font-weight": "bold", "font-size": "smaller" }}
      >
        [relay hints]
      </span>

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
                  style={{ padding: "0 4px", "line-height": "normal" }}
                  onClick={() => handleClickDelete(index())}
                >
                  ✕
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>
      <div
        class={`${className} `}
        style={{
          display: "grid",
          "grid-template-columns": " 1fr auto",
          "margin-bottom": "0.5em",
        }}
      >
        <input
          id="input"
          class={`${className} ${invalid() ? "invalidInput" : "relayInput"} `}
          placeholder="wss://"
          type="text"
          value={inputRelayHint()}
          onInput={(e) => setInputRelayHint(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        ></input>
        <button class={`${className} hint`} onClick={handleClickAdd}>
          Add
        </button>
      </div>
    </>
  );
}
