import { defineConfig } from "wxt";
import Solid from "vite-plugin-solid";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    build: {
      target: "esnext",
    },
    plugins: [Solid()],
  }),
  manifest: {
    permissions: ["storage", "contextMenus"],
    default_locale: "en",
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
  },
});
