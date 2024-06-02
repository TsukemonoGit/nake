import { createSignal, onCleanup, onMount } from "solid-js";

import "./App.css";
import { Settings, defaultSettings, loadSettings } from "@/util";
import { storage } from "wxt/storage";
export default function App() {
  // 設定の初期値を読み込む
  const [settings, setSettings] = createSignal<Settings>(defaultSettings);

  onMount(async () => {
    const savedSettings = await loadSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  });

  // 設定を保存する関数
  const saveSettings = async (settings: Settings) => {
    await storage.setItem("local:appSettings", settings);
  };

  const handleCheckboxChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    console.log(target.checked);
    const newSettings = {
      ...settings(),
      showIconOnTextSelect: target.checked,
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };
  // const handleDarkModeChange = (event: Event) => {
  //   const target = event.target as HTMLInputElement;
  //   const newSettings = {
  //     ...settings(),
  //     darkMode: target.checked,
  //   };
  //   setSettings(newSettings);
  //   saveSettings(newSettings);
  // };
  onCleanup(() => {
    // コンポーネントが破棄される前に実行するクリーンアップ処理
    saveSettings(settings());
  });

  return (
    <div
      style={{
        padding: "12px",
        display: "flex",

        "flex-direction": "column",
        gap: "8px",
      }}
    >
      <label class="custom-checkbox-container">
        テキスト選択時にアイコンを表示する
        <input
          type="checkbox"
          checked={settings().showIconOnTextSelect}
          onChange={handleCheckboxChange}
        />
        <span class="checkmark"></span>
      </label>
      {/* <label class="custom-checkbox-container">
        ダークモード
        <input
          type="checkbox"
          checked={settings().darkMode}
          onChange={handleDarkModeChange}
        />
        <span class="checkmark"></span>
      </label> */}
      {/**他の設定項目 */}
    </div>
  );
}
