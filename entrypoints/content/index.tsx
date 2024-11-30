import { render } from "solid-js/web";
import MenuComponent from "./MenuComponent";
import { createSignal, onMount } from "solid-js";
import {
  hexRegex,
  className,
  encodableRegex,
  nip33Regex,
  relayRegex,
  defaultSettings,
  loadSettings,
  nip49Regex,
  unixtimeRegex,
} from "../../util";
import "./style.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  async main(ctx: any) {
    const [menuPosition, setMenuPosition] = createSignal({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = createSignal("");
    const [isOpen, setIsOpen] = createSignal(false); // nake画面の表示
    const [menuOpen, setMenuOpen] = createSignal(false); // 選択時のアイコンの表示
    const [isTouch, setIsTouch] = createSignal(false);
    const [settings, setSettings] = createSignal(defaultSettings);
    onMount(async () => {
      const settings = await loadSettings();
      if (settings) {
        setSettings(settings);
        //  console.log(settings);
      }
    });
    let port = connectPort();

    function connectPort() {
      const newPort = browser.runtime.connect({ name: "content" });

      newPort.postMessage("ping");
      newPort.onMessage.addListener((message) => {
        //backgroundからのメッセージを受け取る
        if (typeof message === "object") {
          if (message.hasOwnProperty("settings")) {
            setSettings(message.settings);
          } else if (message.hasOwnProperty("isOpen")) {
            setIsOpen(message.isOpen);
          }
        }
      });

      newPort.onDisconnect.addListener(() => {
        // console.log(newPort.error?.message);
        //  console.log("Port disconnected. Attempting to reconnect...");
        port = connectPort(); // 再接続を試みる
      });

      return newPort;
    }

    function ensurePortConnection() {
      if (!port) {
        port = connectPort();
      }
    }

    const ui = createIntegratedUi(ctx, {
      position: "modal",
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
              menuOpen={menuOpen}
              settings={settings}
            />
          ),
          container
        );
      },
      onRemove: (unmount: any) => {
        setIsOpen(false);
        setMenuOpen(false);
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

      // nake開いてる状態でのクリックの場合
      if (isOpen()) {
        // クリックしたのがnakeだったらなにもしない
        if (targetElement.classList.contains(className)) {
          return;
        } else {
          // クリックしたのがnake外だったら閉じる
          closeMenu();
          return;
        }
      }

      const _selectedText = window.getSelection()?.toString().trim();
      if (_selectedText && isValidText(_selectedText)) {
        ensurePortConnection();
        try {
          port.postMessage({ visible: true });
        } catch (error) {
          connectPort();
          port.postMessage({ visible: true });
        }
        const position = getMenuPosition(e);
        setMenuPosition(position);
        setSelectedText(_selectedText);
        setMenuOpen(true);
      } else {
        ensurePortConnection();
        try {
          port.postMessage({ visible: false });
        } catch (error) {
          connectPort();
          port.postMessage({ visible: false });
        }
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
        nip49Regex.test(text) ||
        // || relayRegex.test(text)
        unixtimeRegex.test(text)
      );

      // || relayRegex.test(text)
      // unixtimeRegex.test(text));
    }

    function closeMenu() {
      setIsOpen(false);
      setMenuOpen(false);
      setSelectedText("");
    }
  },
});
