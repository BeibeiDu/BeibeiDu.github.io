import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const contentSecurityPolicy =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "production-csp",
      apply: "build",
      transformIndexHtml(html) {
        return html.replace(
          "<meta name=\"viewport\"",
          `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}" />\n    <meta name="viewport"`
        );
      }
    }
  ],
  preview: {
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": contentSecurityPolicy,
      "Referrer-Policy": "no-referrer"
    }
  }
});
