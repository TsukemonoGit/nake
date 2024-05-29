import Icon from "@/public/wxt.svg";
import {
  createSignal,
  createMemo,
  Show,
  onCleanup,
  createEffect,
  Accessor,
} from "solid-js";
import { className } from "@/util";
import DecodableContent from "./DecodableContent";
import HexContent from "./HexContent";
import { hexRegex, encodableRegex } from "@/util";
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
    //console.log(e);
    checkOverflow();
  };

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
      Math.max(0, props.position.top + 40),
      window.innerHeight - rect.height - 20
    );
    //console.log(window.innerWidth);
    const newLeft = Math.min(
      Math.max(0, props.position.left),
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
    if (props.menuOpen()) {
      const rect = nakeButton?.getBoundingClientRect();
      if (rect) {
        setPos({
          top: props.position.top,
          left: rect.left,
        });
      }
    }
  });

  const nakeContent = createMemo(() => {
    // console.log(props.content);
    // console.log(encodableRegex.test(props.content));
    //console.log(hexRegex.test(props.content));
    if (hexRegex.test(props.content)) {
      return <HexContent content={props.content} />;
    } else if (encodableRegex.test(props.content)) {
      return <DecodableContent content={props.content} />;
    } else {
      return <div>Invalid content</div>;
    }
  });
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

          width: "max-content",
          height: "max-content",
          "z-index": "9999",
          "border-radius": "100%",
          "box-shadow": "2px 2px 10px 0px rgba(0, 0, 0, 0.35)",
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
          <img
            width={24}
            height={24}
            class={props.className}
            src={Icon}
            alt="Translate"
          />
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
              padding: "10px",
              "word-break": "break-all",
              "box-shadow": "2px 2px 10px 0px rgba(0, 0, 0, 0.35)",
            }}
          >
            <button>❌️</button>
            <div class={className}>{nakeContent()}</div>
          </div>
        </Show>
      </div>
    </Show>
  );
}
