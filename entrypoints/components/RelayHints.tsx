import { className, relayRegex } from "@/utils/util";
import {
  Accessor,
  For,
  Setter,
  Show,
  createMemo,
  createSignal,
} from "solid-js";

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
  const inputStyle = createMemo(() => {
    return invalid()
      ? { border: "1px solid #ff8080" }
      : { border: "1px solid #8caeff" };
  });
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
              <div class={`${className} nakeRelay`}>
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
          id="nakeInput"
          class={`${className}`}
          style={inputStyle()}
          placeholder="wss://"
          type="text"
          value={inputRelayHint()}
          onInput={(e) => setInputRelayHint(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        ></input>
        <button class={`${className} nakeHint`} onClick={handleClickAdd}>
          Add
        </button>
      </div>
    </>
  );
}
