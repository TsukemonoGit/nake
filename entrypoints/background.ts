//import { Settings, defaultSettings } from "@/util";
import { browser } from "wxt/browser";

export default defineBackground(() => {
  browser.contextMenus.create({
    id: "nake",
    title: "nake 画面を開く",
    contexts: ["selection"],
    visible: false, // デフォルトでは非表示
  });

  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== "example") return;
    port.onMessage.addListener((message) => {
      console.log(message);

      browser.contextMenus.update("nake", { visible: message });

      browser.contextMenus.onClicked.addListener(function (info, tab) {
        switch (info.menuItemId) {
          case "nake":
            port.postMessage(true);
            break;
        }
      });
    });
    return true;
  });
  // const unwatch = storage.watch<object>(
  //   "local:appSettings",
  //   (newSettingsStr, oldSettingsStr) => {
  //     console.log("appSettings changed:", { newSettingsStr, oldSettingsStr });
  // port.onMessage.addListener((message) => {
  //   console.log("Popup recieved:", message);
  // });
  // console.log("Popup sending:", "ping");
  // port.postMessage(JSON.stringify(newSettingsStr));
  // const unwatch = storage.watch<object>(
  //   "local:appSettings",
  //   (newSettingsStr, oldSettingsStr) => {
  //     console.log("appSettings changed:", { newSettingsStr, oldSettingsStr });
  //   }
  // );
  // browser.runtime.onConnect.addListener((port) => {
  //   if (port.name !== "example") return;
  //   port.onMessage.addListener((message) => {
  //     console.log("Background recieved:", message);
  //     console.log("Background sending:", "pong");
  //     port.postMessage("pong");
  //   });
  // });
  //   browser.runtime.onMessage.addListener(async function (
  //     message: any,
  //     sender: any,
  //     sendResponse: any
  //   ) {
  //     console.log(message);
  //     if (message.message === "copy") {
  //       console.log(message.message);
  //       try {
  //         const text = await navigator.clipboard.readText();
  //         console.log(text);
  //         sendResponse({ result: text });
  //       } catch (error) {
  //         console.log(error);
  //         sendResponse({ error: "error" });
  //       }
  //     }
  //     // 非同期レスポンスを有効にするために、trueを返す
  //     return true;
  //   });
});
// browser.runtime.onMessage.addListener((message, sender) => {
//   if (message.action === "getClipboardText") {
//     readClipboardText().then((text) => {
//       return text;
//     });
//   }
//   return true; // 非同期レスポンスを返すためにtrueを返す
// });
// async function readClipboardText() {
//   try {
//     const text = await workerNavigator.clipboard?.readText();
//     return text;
//   } catch (error) {
//     console.error("Failed to read clipboard text:", error);
//     return null;
//   }
// }
// browser.contextMenus.create({
//   id: "nake",
//   title: "nake 画面を開く",
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
//});
