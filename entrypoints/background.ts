import { browser } from "wxt/browser";
export default defineBackground(() => {
  // browser.contextMenus.create({
  //   id: "mainMenu",
  //   title: "Main Menu",
  //   contexts: ["selection"],
  // });
  // // コンテンツスクリプトからのメッセージを待ち受ける
  // browser.runtime.onMessage.addListener((message, sender) => {
  //   console.log(message);
  //   if (message.action === "showMenu" && message.selectedText) {
  //     //   await browser.storage.local.set({ selectedText: info.selectionText });
  //     // await browser.browserAction.openPopup();
  //     console.log(message.selectionText);
  //     // const url = `https://example.com/search?q=${encodedText}`;
  //     // await browser.tabs.create({ url });
  //     // サブメニューを作成
  //     browser.contextMenus.create({
  //       id: "subMenu",
  //       parentId: "mainMenu", // メインメニューの下に表示する
  //       title: message.selectionText,
  //       contexts: ["selection"],
  //     });
  //     // サブメニューがクリックされたときのリスナー
  //     browser.contextMenus.onClicked.addListener((subInfo, subTab) => {
  //       if (subInfo.menuItemId === "subMenu" && subInfo.selectionText) {
  //         console.log("Sub menu clicked:", subInfo.selectionText);
  //         // ここで選択したテキストに対する処理を行う
  //       }
  //     });
  //   }
  // });
});
