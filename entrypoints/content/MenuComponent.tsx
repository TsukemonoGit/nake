import Icon from "@/public/icon/16.png";
import {
  createSignal,
  createMemo,
  Show,
  onCleanup,
  createEffect,
} from "solid-js";
import { nip19 } from "nostr-tools";

export default function MenuComponent(props: {
  position: { top: number; left: number };
  content: string;
  isOpen: boolean;
  className: string;
  onClose: any;
}) {
  const handleClickIcon = (e: any) => {
    console.log(e);
  };

  const nevent = createMemo(() => {
    try {
      return nip19.neventEncode({ id: props.content });
    } catch (error) {
      return "";
    }
  });

  const note = createMemo(() => {
    try {
      return nip19.noteEncode(props.content);
    } catch (error) {
      return "";
    }
  });

  // // Add event listener for outside clicks
  // document.addEventListener("mousedown", handleClickOutside);
  // // Clean up event listener when component unmounts
  // onCleanup(() => {
  //   document.removeEventListener("mousedown", handleClickOutside);
  // });

  return (
    <div
      id="nake-main"
      class={props.className}
      style={{
        position: "absolute",
        top: `${props.position.top}px`,
        left: `${props.position.left}px`,
        background: "white",
        border: "1px solid #ccc",
        padding: "5px",
        width: "max-content",
        height: "max-content",
      }}
    >
      <button
        id="selectionMenu"
        class={props.className}
        type="button"
        style={{
          padding: "5px",
        }}
        onClick={handleClickIcon}
      >
        <img class={props.className} src={Icon} alt="Translate" />
      </button>{" "}
      <Show when={props.isOpen}>
        <div class={props.className}>
          <h2 class={props.className}>selected: {props.content}</h2>
          <p class={props.className}>{nevent()}</p>
          <p class={props.className}>{note()}</p>
        </div>
      </Show>
    </div>
  );
}
