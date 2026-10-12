import { useEffect, useState } from "react";
import { apiUrl } from "../config.js";

const fmt = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function Counter({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    let raf;
    const t0 = performance.now();
    const D = 1400;
    const tick = (t) => {
      const p = Math.min((t - t0) / D, 1);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return fmt.format(Math.round(n));
}

export default function Stats() {
  const [s, setS] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/stats/"))
      .then((r) => r.json())
      .then(setS)
      .catch(() => {});
  }, []);

  if (!s || s.source !== "youtube") return null;

  const items = [
    ["Subscribers", s.subscribers],
    ["Total views", s.views],
    ["Videos", s.videos],
  ];

  return (
    <div className="stats">
      {items.map(([label, v]) => (
        <div className="stat" key={label}>
          <strong><Counter value={v} /></strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}