import { useEffect, useRef, useState } from "react";

function getVoterKey() {
  let key = localStorage.getItem("voter_key");
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("voter_key", key);
  }
  return key;
}

export default function Arena() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState("");
  const retry = useRef();

  // live updates over WebSocket (auto-reconnect)
  useEffect(() => {
    let ws;
    let closed = false;
    const connect = () => {
      const proto = location.protocol === "https:" ? "wss" : "ws";
      ws = new WebSocket(`${proto}://${location.host}/ws/arena/`);
      ws.onopen = () => setStatus("live");
      ws.onmessage = (e) => setData(JSON.parse(e.data));
      ws.onclose = () => {
        setStatus("offline");
        if (!closed) retry.current = setTimeout(connect, 2000);
      };
    };
    connect();
    return () => {
      closed = true;
      clearTimeout(retry.current);
      if (ws) ws.close();
    };
  }, []);

  // remember per challenge if this browser already voted
  useEffect(() => {
    if (data?.id) setVoted(localStorage.getItem(`voted:${data.id}`) === "1");
  }, [data?.id]);

  async function vote(optionId) {
    setError("");
    try {
      const res = await fetch("/api/arena/vote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option_id: optionId, voter_key: getVoterKey() }),
      });
      if (res.ok || res.status === 409) {
        localStorage.setItem(`voted:${data.id}`, "1");
        setVoted(true);
        if (res.ok) setData(await res.json());
      } else if (res.status === 429) {
        setError("Too many votes from your network. Try again in a minute.");
      } else {
        setError("Vote failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  }

  if (!data || !data.options) {
    return <p>{status === "live" ? "No active challenge right now." : "Connecting to the arena..."}</p>;
  }

  const total = data.total_votes;
  const top = Math.max(...data.options.map((o) => o.votes));

  return (
    <div className="arena">
      <p className="arena-q">{data.title}</p>
      {data.description && <p className="arena-d">{data.description}</p>}

      <div className="arena-opts">
        {data.options.map((o) => {
          const pct = total ? Math.round((o.votes / total) * 100) : 0;
          return voted ? (
            <div className={`bar ${o.votes === top && top > 0 ? "lead" : ""}`} key={o.id}>
              <div className="fill" style={{ width: `${pct}%` }} />
              <span className="bar-label">{o.label}</span>
              <span className="bar-pct">{pct}% · {o.votes}</span>
            </div>
          ) : (
            <button className="vote-btn" key={o.id} onClick={() => vote(o.id)}>
              {o.label}
            </button>
          );
        })}
      </div>

      {error && <p className="arena-err">{error}</p>}
      <p className="arena-meta">
        <span className={`dot ${status}`} /> {status === "live" ? "Live" : "Reconnecting"} · {total} votes
      </p>
    </div>
  );
}