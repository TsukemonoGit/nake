import { render } from "solid-js/web";
import MenuComponent from "./MenuComponent";
import { BECH32_REGEX } from "nostr-tools/nip19";
import { createSignal } from "solid-js";

export default defineContentScript({
  matches: ["<all_urls>"],

  async main(ctx: any) {
    const className = "nake";
    const [menuPosition, setMenuPosition] = createSignal({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = createSignal("");
    const [isOpen, setIsOpen] = createSignal(false);

    const hexRegex = /^[0-9a-fA-F]{64}$/;

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
              isOpen={isOpen()}
              className={className}
              onClose={() => ui.remove()}
            />
          ),
          container
        );
      },
      onRemove: (unmount: any) => {
        // Unmount the app when the UI is removed
        if (unmount) {
          unmount();
        }
      },
    });

    //
    // document.addEventListener("selectionchange", async (e) => {
    //   //このeでは何をクリックされたか検知できない市メニュー内クリックしたときもセレクトが切れるからだめ
    //   if (selectedText()) {
    //     setSelectedText("");
    //   }
    // });
    document.addEventListener("mouseup", async (e) => {
      const targetElement = e.target as HTMLElement;

      //menu開く（nake詳細表示）
      if (targetElement.closest("#selectionMenu")) {
        setIsOpen(true);
        return;
      }

      //nake開いててnake外だったら閉じる
      if (isOpen()) {
        if (!targetElement.classList.contains(className)) {
          setIsOpen(false);
          ui.remove();
          setSelectedText("");
          return;
        }
        return;
      }
      const _selectedText = window?.getSelection()?.toString().trim();

      //選択中の文字列がnakeアイコン表示する対象か?
      if (
        _selectedText &&
        _selectedText.length >= 63 &&
        (BECH32_REGEX.test(_selectedText) || hexRegex.test(_selectedText))
      ) {
        //アイコンを表示する場所
        const top = e.clientY + window.scrollY + 20;
        const left = e.clientX + window.scrollX + 10;
        setMenuPosition({ top, left });
        setSelectedText(_selectedText);
        //メニュー表示
        ui.mount();
        console.log(_selectedText);
      }
    });
    // document.addEventListener("mousedown", function (event) {
    //   const targetElement = event.target as HTMLElement;
    //   console.log(targetElement.nodeName);
    //   console.log(targetElement.nodeType);
    //   console.log(targetElement.children);
    //   console.log(targetElement.parentNode);
    //   console.log(targetElement.childNodes);
    //   if (!targetElement.closest("#selectionMenu")) {
    //     ui.remove();
    //   }
    // });

    //main
  },
});
