import { useEffect, useRef, useState } from "react";

const COLORS = ["#ffd400", "#1a4dff", "#ffffff", "#ff4d6d", "#3ddc84"];

function getVoterKey() {
  let key = localStorage.getItem("voter_key");
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem("voter_key", key);
  }
  return key;
}

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 44 }, (_, i) => ({
      dx: (Math.random() - 0.5) * 520,
      dy: Math.random() * 380 - 140,
      rot: (Math.random() - 0.5) * 900,
      c: COLORS[i % COLORS.length],
      delay: Math.random() * 120,
    }))
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.current.map((p, i) => (
        <i
          key={i}
          style={{
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            "--rot": `${p.rot}deg`,
            "--c": p.c,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

function Bar({ option, pct, lead, mine }) {
  const [w, setW] = useState(0);
  // start at 0, then grow, so the bar "reveals" with animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className={`bar ${lead ? "lead" : ""} ${mine ? "mine" : ""}`}>
      <div className="fill" style={{ width: `${w}%` }} />
      <span className="bar-label">
        {lead && "👑 "}
        {option.label}
        {mine && <em> · your vote</em>}
      </span>
      <span className="bar-pct">
        {pct}% · {option.votes}
      </span>
    </div>
  );
}

export default function Arena() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [voted, setVoted] = useState(false);
  const [picked, setPicked] = useState(null);
  const [confetti, setConfetti] = useState(0);
  const [error, setError] = useState("");
  const retry = useRef();
  const confettiTimer = useRef();

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
      clearTimeout(confettiTimer.current);
      if (ws) ws.close();
    };
  }, []);

  // remember per challenge if this browser already voted (and for what)
  useEffect(() => {
    if (!data?.id) return;
    setVoted(localStorage.getItem(`voted:${data.id}`) === "1");
    setPicked(Number(localStorage.getItem(`pick:${data.id}`)) || null);
  }, [data?.id]);

  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setConfetti((c) => c + 1);
    clearTimeout(confettiTimer.current);
    confettiTimer.current = setTimeout(() => setConfetti(0), 2000);
  }

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
        if (res.ok) {
          localStorage.setItem(`pick:${data.id}`, String(optionId));
          setPicked(optionId);
          setData(await res.json());
          celebrate();
        }
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
      {confetti > 0 && <Confetti key={confetti} />}

      <p className="arena-q">{data.title}</p>
      {data.description && <p className="arena-d">{data.description}</p>}

      <div className="arena-opts">
        {data.options.map((o) => {
          const pct = total ? Math.round((o.votes / total) * 100) : 0;
          return voted ? (
            <Bar
              key={o.id}
              option={o}
              pct={pct}
              lead={top > 0 && o.votes === top}
              mine={o.id === picked}
            />
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