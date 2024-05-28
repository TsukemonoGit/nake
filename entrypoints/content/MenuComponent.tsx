import Icon from "@/public/icon/16.png";
import {
  createSignal,
  createMemo,
  Show,
  onCleanup,
  createEffect,
  Accessor,
} from "solid-js";
import { nip19 } from "nostr-tools";

export default function MenuComponent(props: {
  position: { top: number; left: number };
  content: string;
  isOpen: Accessor<boolean>;
  className: string;
  menuOpen: Accessor<boolean>;
}) {
  const [pos, setPos] = createSignal({
    top: props.position.top,
    left: props.position.left,
  });

  const handleClickIcon = (e: any) => {
    console.log(e);
    checkOverflow();
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

  let overflowCheck: HTMLDivElement | null = null;
  let nakeButton: HTMLButtonElement | null = null;

  const checkOverflow = () => {
    if (!overflowCheck) return;
    const rect = overflowCheck.getBoundingClientRect();
    const buttonRect = nakeButton?.getBoundingClientRect();
    if (!rect || !buttonRect) {
      return;
    }
    const newTop = Math.min(
      Math.max(0, pos().top + 40),
      window.innerHeight - rect.height
    );
    console.log(window.innerWidth);
    const newLeft = Math.min(
      Math.max(0, pos().left),
      Math.max(0, window.innerWidth - rect.width - 20)
    );
    setPos({ top: newTop, left: newLeft });
  };

  // createEffect(() => {
  //   if (props.isOpen()) {
  //     checkOverflow();
  //   }
  // });
  createEffect(() => {
    console.log("efe");
    const rect = nakeButton?.getBoundingClientRect();
    if (props.menuOpen() && rect) {
      setPos({
        top: props.position.top,
        left: rect.left,
      });
    }
  }, props.menuOpen() as boolean);
  return (
    <Show when={props.menuOpen()}>
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
          ref={(el) => {
            nakeButton = el;
          }}
          id="selectionMenu"
          class={props.className}
          type="button"
          style={{
            padding: "5px",
          }}
          onClick={handleClickIcon}
        >
          <img class={props.className} src={Icon} alt="Translate" />
        </button>
        <Show when={props.isOpen()}>
          <div
            ref={(el) => {
              overflowCheck = el;
            }}
            class={props.className}
            style={{
              position: "fixed",
              top: `${pos().top}px`,
              left: `${pos().left}px`,
              width: "350px",
              "overflow-x": "auto",
              background: "white",
              border: "1px solid #ccc",
              padding: "5px",
              "word-break": "break-all",
            }}
          >
            <h2 class={props.className}>selected: {props.content}</h2>
            <p class={props.className}>{nevent()}</p>
            <p class={props.className}>{note()}</p>
          </div>
        </Show>
      </div>
    </Show>
  );
}
