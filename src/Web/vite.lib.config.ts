/**
 * Library build — produces the publishable `@rbi/design-system` package.
 *
 * Separate from vite.config.ts on purpose: the app build needs the TanStack
 * Start/Nitro pipeline, the library must stay a plain ESM component build.
 *
 * Design decisions:
 * - `preserveModules` keeps one output file per source file, so consumers can
 *   deep-import a single component and bundlers can tree-shake the barrel.
 * - every runtime dependency stays external (peer dependency) so the consuming
 *   app owns React, Radix and Tailwind — no duplicated React in the graph.
 * - CSS (design tokens + Amalia @font-face) is copied verbatim; it is imported
 *   by the consumer's Tailwind v4 entry, not bundled into JS.
 *
 * Run with `pnpm build:lib`.
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { globSync } from "tinyglobby";
import { defineConfig, type Plugin } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(rootDir, "packages/rbi-design-system");
const outDir = resolve(packageDir, "dist");

/** Source files that make up the public surface. Site-only code is excluded. */
const entryGlobs = [
  "src/library/index.ts",
  "src/components/ui/*.tsx",
  "src/components/layout/primitives.tsx",
  "src/components/patterns/app-page-patterns.tsx",
  "src/components/brand/rbi-logo.tsx",
  "src/components/brand/slogan.tsx",
  "src/design-system/**/*.ts",
  "src/lib/utils.ts",
  "src/lib/color/contrast.ts",
  "src/hooks/use-mobile.tsx",
];

const entries = globSync(entryGlobs, { cwd: rootDir, absolute: true });

/** Runtime deps the consumer provides. Everything in package.json counts. */
const appPackageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8")) as {
  dependencies: Record<string, string>;
};
const externalPackages = Object.keys(appPackageJson.dependencies);

const isExternal = (id: string) =>
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`)) ||
  id.startsWith("node:") ||
  id === "react/jsx-runtime";

/** Copies the token/font stylesheets next to the JS output. */
function copyStylesheets(): Plugin {
  return {
    name: "rbi-copy-stylesheets",
    closeBundle() {
      mkdirSync(resolve(outDir, "styles"), { recursive: true });
      cpSync(resolve(rootDir, "src/styles.css"), resolve(outDir, "styles.css"));
      cpSync(resolve(rootDir, "src/styles/fonts.css"), resolve(outDir, "styles/fonts.css"));
      writeFileSync(
        resolve(outDir, "tokens.css"),
        `/* Tokens + @font-face only, without Tailwind's base layer. */\n@import "./styles/fonts.css";\n`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), copyStylesheets()],
  resolve: {
    alias: { "@": resolve(rootDir, "src") },
  },
  build: {
    outDir,
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    target: "es2022",
    lib: {
      entry: entries,
      formats: ["es"],
    },
    rollupOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
