import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

/** Standalone application build; no hosted editor or proxy is required. */
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
      // The ASP.NET Core host serves this generated shell in production.
      // Keeping the UI as an SPA gives the template one deployable process
      // while preserving TanStack Router's typed routes.
      spa: { enabled: true },
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
    }),
    nitro(),
    react(),
  ],
  css: { transformer: "lightningcss" },
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom", "@tanstack/react-query", "@tanstack/query-core"],
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": "http://127.0.0.1:5000",
      "/health": "http://127.0.0.1:5000",
      "/openapi": "http://127.0.0.1:5000",
    },
  },
});
