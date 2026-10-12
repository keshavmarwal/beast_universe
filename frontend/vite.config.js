import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Default: local backend. Live backend se test karna ho to:
// PROXY_TARGET=https://beast-universe.onrender.com npm run dev
const target = process.env.PROXY_TARGET || "http://localhost:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": { target, changeOrigin: true, secure: true },
      "/ws": { target, changeOrigin: true, secure: true, ws: true },
    },
  },
});