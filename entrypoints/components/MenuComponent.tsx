import Icon from "@/public/wxt.svg";
import {
  createSignal,
  createMemo,
  Show,
  onCleanup,
  createEffect,
  Accessor,
} from "solid-js";
import { className, nip33Regex, relayRegex } from "@/util";
import DecodableContent from "./DecodableContent";
import HexContent from "./HexContent";
import { hexRegex, encodableRegex } from "@/util";
import Nip33AtagContent from "./Nip33AtagContent";
import RelayContent from "./RelayContent";

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
      Math.max(0, buttonRect.top + 20),
      window.innerHeight - rect.height - 20
    );

    const newLeft = Math.min(
      Math.max(0, buttonRect.left + 30),
      Math.max(0, window.innerWidth - rect.width - 20)
    );
    setPos({ top: newTop, left: newLeft });
  };

  createEffect(() => {
    if (props.menuOpen()) {
      const rect = nakeButton?.getBoundingClientRect();
      if (rect) {
        setPos({
          top: rect.top + 20,
          left: rect.left,
        });
      }
    }
  });

  const nakeContent = createMemo(() => {
    if (hexRegex.test(props.content)) {
      return <HexContent content={props.content} />;
    } else if (encodableRegex.test(props.content)) {
      return <DecodableContent content={props.content} />;
    } else if (nip33Regex.test(props.content)) {
      return <Nip33AtagContent content={props.content} />;
    } else if (relayRegex.test(props.content)) {
      return <RelayContent content={props.content} />;
    } else {
      return <div>Invalid content</div>;
    }
  });

  const [isDragging, setIsDragging] = createSignal(false);
  const [dragStart, setDragStart] = createSignal({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging()) return;
    const dx = e.clientX - dragStart().x;
    const dy = e.clientY - dragStart().y;
    setPos((prev) => ({
      top: prev.top + dy,
      left: prev.left + dx,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging()) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart().x;
    const dy = touch.clientY - dragStart().y;
    setPos((prev) => ({
      top: prev.top + dy,
      left: prev.left + dx,
    }));
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  // Cleanup event listeners on component unmount
  onCleanup(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
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
            padding: "4px",
            display: "flex",
            width: "32px",
            height: "32px",
            "justify-content": "center",
            "vertical-align": "middle",
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

              "word-break": "break-all",
              "box-shadow": "2px 2px 10px 0px rgba(0, 0, 0, 0.35)",
              display: "grid",
              "grid-template-columns": "auto 1fr",

              "border-radius": "0.5em",
            }}
          >
            <div
              class={`${className}`}
              style={{
                cursor: "move",
                "background-color": "#ccc",
                display: "flex",
                "justify-content": "center",
                "vertical-align": "middle",
                "align-items": "center",
                "border-right": " 1px solid #bbb",
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <svg
                class={`${className}`}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 256 256"
              >
                <path
                  fill="#888"
                  d="M108 60a16 16 0 1 1-16-16a16 16 0 0 1 16 16m56 16a16 16 0 1 0-16-16a16 16 0 0 0 16 16m-72 36a16 16 0 1 0 16 16a16 16 0 0 0-16-16m72 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16m-72 68a16 16 0 1 0 16 16a16 16 0 0 0-16-16m72 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16"
                />
              </svg>
            </div>
            <div
              class={`${className}`}
              style={{
                display: "flex",
                "flex-direction": "column",
              }}
            >
              <div
                class={`${className}`}
                style={{
                  padding: "4px 8px 1px  8px",

                  display: "flex",
                  "flex-direction": "row",
                  "border-bottom": " 1px solid #ddd",
                  "justify-content": "space-between",
                  "background-color": "#eee",
                }}
              >
                <div
                  class={`${className}`}
                  style={{
                    display: "flex",
                    "flex-direction": "row",
                    gap: "4px",
                  }}
                >
                  <img
                    width={24}
                    height={24}
                    class={props.className}
                    src={Icon}
                    alt="Translate"
                  />
                  NAKE
                </div>
                <button
                  id="batuButton"
                  style={{
                    padding: "0",
                    "align-self": "end",
                  }}
                >
                  ❌️
                </button>
              </div>
              <div class={className} style={{ padding: "6px" }}>
                {nakeContent()}
              </div>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
}
