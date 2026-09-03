import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://plinth.dev",
  output: "static",
  trailingSlash: "never",
  vite: {
    server: {
      proxy: {
        "/v1": "http://localhost:8787",
        "/mcp": "http://localhost:8787",
        "/health": "http://localhost:8787",
      },
    },
  },
});
