import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import "./App.css";
import Icon from "@/public/wxt.svg";
import { encodableRegex, hexRegex, nip33Regex, relayRegex } from "@/util";
import HexContent from "../components/HexContent";
import DecodableContent from "../components/DecodableContent";
import Nip33AtagContent from "../components/Nip33AtagContent";
import RelayContent from "../components/RelayContent";
function App() {
  const [selectedText, setSelectedText] = createSignal("");

  // const readClipboardText = () => {
  //   browser.runtime
  //     .sendMessage({ action: "getClipboardText" })
  //     .then((response) => {
  //       if (response && response.text) {
  //         // クリップボードから取得したテキストを使用してポップアップの表示を更新するなどの処理を行う
  //         setSelectedText(response.text);
  //       }
  //     });
  // };

  // onMount(() => {
  //   console.log(document.visibilityState);
  //   if (document.visibilityState === "visible") {
  //     readClipboardText();
  //   }
  // });

  // document.addEventListener("visibilitychange", () => {
  //   console.log(document.visibilityState);
  //   if (document.visibilityState === "visible") {
  //     readClipboardText();
  //   }
  // });

  const nakeContent = createMemo(() => {
    // console.log(selectedText());
    // console.log(encodableRegex.test(props.content));
    //console.log(hexRegex.test(props.content));
    if (selectedText()) {
      if (hexRegex.test(selectedText())) {
        return <HexContent content={selectedText()} />;
      } else if (encodableRegex.test(selectedText())) {
        return <DecodableContent content={selectedText()} />;
      } else if (nip33Regex.test(selectedText())) {
        return <Nip33AtagContent content={selectedText()} />;
      } else if (relayRegex.test(selectedText())) {
        return <RelayContent content={selectedText()} />;
      }
    } else {
      return <div>Invalid content</div>;
    }
  });
  // browser.runtime.sendMessage({
  //   extensionId: browser.runtime.id,
  //   message: "copy",
  //   function(response: { result: any }) {
  //     console.log(response.result);
  //   },
  // });

  return (
    <div>
      <h2>
        <img
          width={20}
          height={20}
          src={Icon}
          alt="nake"
          style={{ "margin-right": "0.5em" }}
        />
        NAKE
      </h2>
      <input
        class={"nakeInput"}
        style={{ margin: "1em 0", "min-width": "350px", "max-width": "90vw" }}
        type="text"
        placeholder="hex or note1,npub1,..."
        onInput={(e) => setSelectedText(e.target.value)}
      />
      <div style={{ "min-width": "350px", "max-width": "90vw" }}>
        {nakeContent()}
      </div>
    </div>
  );
}

export default App;
