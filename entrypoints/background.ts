//background.ts
import { Settings } from "@/util";
import { Menus, Runtime, browser } from "wxt/browser";

export default defineBackground(() => {
  initializeContextMenu();

  browser.runtime.onConnect.addListener(handlePortConnection);
});

/**
 * コンテキストメニューの初期設定を行う関数
 */
function initializeContextMenu(): void {
  // メニュー項目が既に存在するかどうかを確認する
  browser.contextMenus.update("openNake", { visible: false }).catch(() => {
    // メニュー項目が存在しない場合にのみ作成
    browser.contextMenus.create({
      id: "openNake",
      title: browser.i18n.getMessage("setting_visibleIcon"),
      contexts: ["selection"],
      visible: false, // デフォルトでは非表示
    });
  });
}
let isContentConnected = false;
/**
 * ポート接続時の処理を行う関数
 * @param port - 接続されたポートオブジェクト
 */
function handlePortConnection(port: Runtime.Port): void {
  if (port.name === "content") {
    isContentConnected = true;
    port.onMessage.addListener((message) =>
      handleMessageFromContentScript(message, port)
    );
    port.onDisconnect.addListener(() => {
      //console.log("Port disconnected.");
      isContentConnected = false;
    });
    browser.contextMenus.onClicked.addListener((info, tab) =>
      handleContextMenuClick(info, port)
    );
    storageWatch(port);
  }
}

function storageWatch(port: Runtime.Port) {
  const unwatch = storage.watch<Settings>(
    "local:appSettings",
    (newSettings, oldSettings) => {
      //console.log("appSettings changed:", { newSettings, oldSettings });
      //設定変更されたときにポートが開いていたら変更を通知
      if (isContentConnected && newSettings) {
        try {
          port.postMessage({ settings: newSettings });
        } catch (error) {
          //  console.log(error);
        }
      }
    }
  );
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
    browser.contextMenus.update("openNake", { visible: message.visible });
  }
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
  if (info.menuItemId === "openNake" && isContentConnected) {
    try {
      port.postMessage({ isOpen: true });
    } catch (error) {
      // console.log(error);
    }
  }
}
