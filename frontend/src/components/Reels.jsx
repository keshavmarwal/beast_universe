import { useEffect, useState } from "react";

export default function Reels() {
  const [state, setState] = useState({ source: "loading", items: [] });
  useEffect(() => {
    fetch("/api/reels/")
      .then((r) => r.json())
      .then(setState)
      .catch(() => setState({ source: "error", items: [] }));
  }, []);

  const empty = state.items.length === 0;
  const message = {
    loading: "Loading Shorts...",
    demo: "Add YOUTUBE_API_KEY in backend/.env to load live Shorts.",
    error: "Could not load Shorts. Check the API key and quota, then refresh.",
  }[state.source];

  return (
    <section className="panel reels" data-cursor="reels">
      <h2>Shorts</h2>
      {empty && <p>{message}</p>}
      <div className="feed">
        {empty
          ? [1, 2, 3].map((n) => <div className="reel placeholder" key={n} />)
          : state.items.map((v) => (
              <div className="reel" key={v.id}>
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}?playsinline=1&rel=0`}
                  title={v.title}
                  loading="lazy"
                  allow="encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
      </div>
    </section>
  );
}
