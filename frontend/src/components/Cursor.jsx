import { useEffect, useRef } from "react";

// const ICONS = { default: "●", feastables: "🍫", games: "◎", reels: "▶" };
// const ICONS = { default: "●", feastables: "🍫", games: "◎", reels: "▶", playlist: "🎧" };
const ICONS = { default: "●", feastables: "🍫", games: "◎", reels: "▶", playlist: "🎧", ideas: "💡", impact: "❤" };
export default function Cursor() {
  const el = useRef(null);
  useEffect(() => {
    const move = (e) => {
      const node = el.current;
      if (!node) return;
      node.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const zone = e.target.closest?.("[data-cursor]")?.dataset.cursor || "default";
      node.textContent = ICONS[zone] || ICONS.default;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={el} className="cursor" aria-hidden="true">●</div>;
}
