// Local dev: VITE_API_BASE khaali rehta hai, to vite ka proxy kaam karta hai.
// Production (Netlify): VITE_API_BASE = https://beast-universe.onrender.com
const base = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

export const apiUrl = (path) => `${base}${path}`;

export const wsUrl = (path) => {
  if (base) return base.replace(/^http/, "ws") + path; // https -> wss, http -> ws
  const proto = location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${location.host}${path}`;
};