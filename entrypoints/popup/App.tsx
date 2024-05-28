import { createSignal, onMount } from "solid-js";
import "./App.css";
import { browser } from "wxt/browser";
function App() {
  // const [selectedText, setSelectedText] = createSignal("");

  onMount(async () => {
    // const { selectedText } = await browser.storage.local.get("selectedText");
    //  setSelectedText(selectedText || "No text selected");
  });

  return (
    <div>
      <h1>Popup</h1>
    </div>
  );
}

export default App;
