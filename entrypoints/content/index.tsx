import { render } from "solid-js/web";
import MenuComponent from "./MenuComponent";
import { createSignal } from "solid-js";
import {
  hexRegex,
  className,
  encodableRegex,
  nip33Regex,
  relayRegex,
} from "../../util";
import "./style.css";
export default defineContentScript({
  matches: ["<all_urls>"],
  async main(ctx: any) {
    const [menuPosition, setMenuPosition] = createSignal({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = createSignal("");
    const [isOpen, setIsOpen] = createSignal(false); //nake画面の表示
    const [menuOpen, setMenuOpen] = createSignal(false); //選択時のアイコンの表示
    const [isTouch, setIsTouch] = createSignal(false);

    const port = browser.runtime.connect({ name: "content" });
    port.postMessage("ping");
    port.onMessage.addListener((message) => {
      if (message) {
        setIsOpen(true);
      }
    });
    port.onDisconnect.addListener(() => {
      console.log("Port disconnected. Attempting to reconnect...");
      port.postMessage("ping");
    });
    const ui = createIntegratedUi(ctx, {
      //createShadowRootUi
      //  name: "menu-component",
      position: "modal", //
      anchor: "body",
      append: "before",

      onMount: (container) => {
        render(
          () => (
            <MenuComponent
              position={menuPosition()}
              content={selectedText()}
              isOpen={isOpen}
              className={className}
              //onClose={() => ui.remove()}
              menuOpen={menuOpen}
            />
          ),
          container
        );
      },
      onRemove: (unmount: any) => {
        setIsOpen(false);
        setMenuOpen(false);
        // Unmount the app when the UI is removed
        if (unmount) {
          unmount();
        }
      },
    });
    ui.mount();

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);

    function handleMouseUp(e: MouseEvent) {
      if (isTouch()) return;
      handleSelection(e);
    }

    function handleTouchEnd(e: TouchEvent) {
      setIsTouch(true);
      handleSelection(e);
    }

    function handleSelection(e: MouseEvent | TouchEvent) {
      const targetElement = e.target as HTMLElement;

      if (targetElement.closest("#selectionMenu")) {
        setIsOpen(true);
        return;
      }
      //nake開いてる状態でのクリックの場合
      if (isOpen()) {
        //クリックしたのがnakeだったらなにもしない
        if (targetElement.classList.contains(className)) {
          return;
        } else {
          //クリックしたのがnake外だったら閉じる
          closeMenu();
          return;
        }
      }

      const _selectedText = window.getSelection()?.toString().trim();
      //portの接続切れのエラーが出るから送る直前にコネクトしてみる
      const port = browser.runtime.connect({ name: "content" });
      if (_selectedText && isValidText(_selectedText)) {
        port.postMessage({ visible: true });
        const position = getMenuPosition(e);
        setMenuPosition(position);
        setSelectedText(_selectedText);
        setMenuOpen(true);
      } else {
        port.postMessage({ visible: false });
        closeMenu();
      }
    }

    function getMenuPosition(e: MouseEvent | TouchEvent) {
      if (e instanceof MouseEvent) {
        return {
          top: e.clientY + window.scrollY + 20,
          left: e.clientX + window.scrollX + 10,
        };
      } else if (e instanceof TouchEvent) {
        return {
          top: e.changedTouches[0].clientY + window.scrollY + 20,
          left: e.changedTouches[0].clientX + window.scrollX + 10,
        };
      }
      return { top: 0, left: 0 };
    }

    function isValidText(text: string) {
      return (
        encodableRegex.test(text) ||
        hexRegex.test(text) ||
        nip33Regex.test(text) ||
        relayRegex.test(text)
      );
    }

    function closeMenu() {
      setIsOpen(false);
      setMenuOpen(false);
      setSelectedText("");
    }
  },
});
