import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    hookTimeout: 120_000,
    testTimeout: 30_000,
    fileParallelism: false,
    // next-auth's ESM build imports "next/server" without an extension; let Vite resolve it.
    server: { deps: { inline: [/next-auth/, /@auth\//] } },
  },
});
