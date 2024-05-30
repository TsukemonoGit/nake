import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import "./App.css";
import Icon from "@/public/wxt.svg";
import { encodableRegex, hexRegex } from "@/util";
import HexContent from "../content/HexContent";
import DecodableContent from "../content/DecodableContent";
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
    // console.log(props.content);
    // console.log(encodableRegex.test(props.content));
    //console.log(hexRegex.test(props.content));
    if (hexRegex.test(selectedText())) {
      return <HexContent content={selectedText()} />;
    } else if (encodableRegex.test(selectedText())) {
      return <DecodableContent content={selectedText()} />;
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
