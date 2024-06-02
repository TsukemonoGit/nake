import { Menus, Runtime, browser } from "wxt/browser";

export default defineBackground(() => {
  initializeContextMenu();

  browser.runtime.onConnect.addListener(handlePortConnection);
});

/**
 * コンテキストメニューの初期設定を行う関数
 */
function initializeContextMenu(): void {
  browser.contextMenus.create({
    id: "nake",
    title: "open nake",
    contexts: ["selection"],
    visible: false, // デフォルトでは非表示
  });
}

/**
 * ポート接続時の処理を行う関数
 * @param port - 接続されたポートオブジェクト
 */
function handlePortConnection(port: Runtime.Port): void {
  if (port.name === "content") {
    port.onMessage.addListener((message) =>
      handleMessageFromContentScript(message, port)
    );
  }
}

/**
 * コンテンツスクリプトからのメッセージを処理する関数
 * @param message - 受信したメッセージオブジェクト
 * @param port - 接続されたポートオブジェクト
 */
function handleMessageFromContentScript(
  message: any,
  port: Runtime.Port
): void {
  if (typeof message === "object" && message.hasOwnProperty("visible")) {
    browser.contextMenus.update("nake", { visible: message.visible });
  }
  browser.contextMenus.onClicked.addListener((info, tab) =>
    handleContextMenuClick(info, port)
  );
}

/**
 * コンテキストメニューがクリックされたときの処理を行う関数
 * @param info - クリックイベント情報
 * @param port - 接続されたポートオブジェクト
 */
function handleContextMenuClick(
  info: Menus.OnClickData,
  port: Runtime.Port
): void {
  if (info.menuItemId === "nake") {
    port.postMessage(true);
  }
}
