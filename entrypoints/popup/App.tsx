import { createMemo, createSignal } from "solid-js";
import "./App.css";
import Icon from "@/wxt.svg";
import {
  encodableRegex,
  hexRegex,
  nip33Regex,
  nip49Regex,

} from "@/utils/util";
import HexContent from "../components/HexContent";
import DecodableContent from "../components/DecodableContent";
import Nip33AtagContent from "../components/Nip33AtagContent";
import UnixTime from "../components/UnixTime";
import Nip49Content from "../components/Nip49Content";
import "@konemono/nostr-share-component"

function App() {
  const [selectedText, setSelectedText] = createSignal("");

  const nakeContent = createMemo(() => {
    if (!selectedText() || selectedText() === "") {
      return <></>;
    }
    if (selectedText()) {
      if (/^\d+$/.test(selectedText())) {
        return <UnixTime content={selectedText()} />;
      } else if (hexRegex.test(selectedText())) {
        return <HexContent content={selectedText()} />;
      } else if (encodableRegex.test(selectedText())) {
        return <DecodableContent content={selectedText()} />;
      } else if (nip33Regex.test(selectedText())) {
        return <Nip33AtagContent content={selectedText()} />;
      } else if (nip49Regex.test(selectedText())) {
        return <Nip49Content content={selectedText()} />;
      }
      //else if (relayRegex.test(selectedText())) {
      //  return <RelayContent content={selectedText()} />;
      // }
    } else {
      return <div>Invalid content</div>;
    }
  });

  const onClickSettings = () => {
    browser.runtime.openOptionsPage();
  };
  const onClickHome = () => {
    browser.tabs.create({
      url: "https://tsukemonogit.github.io/nake-website/",
    });
  };
  return (
    <div style={{ "min-height": "12em" }}>
      <h2 style={{ display: "flex", "align-items": "center" }}>
        <img
          width={20}
          height={20}
          src={Icon}
          alt="nake"
          style={{ "margin-right": "0.5em" }}
        />
        NAKE
        <div style="margin-left: auto; display: flex; align-items: center">
          <button onClick={onClickSettings} class="icon" title="settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zM11 20h1.975l.35-2.65q.775-.2 1.438-.587t1.212-.938l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12t-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587zm1.05-4.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5M12 12"
              />
            </svg>
          </button>
          <button title="home" onClick={onClickHome} class="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19"
              />
            </svg>
          </button>

          <div style={{ height: "32px", display: "flex", "align-items": "center" }}>
            {/*@ts-ignore */}
            <nostr-share
              data-text="NAKE (Nostr Army Knife Extension)
https://tsukemonogit.github.io/nake-website/"
              data-type="icon"
              icon-size="24"
            >{/*@ts-ignore */}
            </nostr-share>
          </div>
        </div>
      </h2>

      <input
        class={"nakeInput"}
        style={{ margin: "1em 0", "min-width": "350px", "max-width": "90vw" }}
        type="text"
        placeholder="hex or note1,npub1,...,unix timestamp in seconds"
        onInput={(e) => setSelectedText(e.target.value)}
      />
      <div style={{ "min-width": "350px", "max-width": "90vw" }}>
        {nakeContent()}
      </div>
    </div>
  );
}

export default App;
