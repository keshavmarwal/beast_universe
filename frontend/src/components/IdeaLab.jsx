import { useState } from "react";
import { apiUrl } from "../config.js";

const SUGGESTIONS = ["cricket", "pizza", "escape room", "school"];

export default function IdeaLab() {
  const [theme, setTheme] = useState("");
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(t) {
    const value = (t ?? theme).trim();
    if (value.length < 2 || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/ideas/generate/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: value }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) setIdea(body);
      else setError(body.detail || "Something went wrong.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="idealab">
      <div className="idea-row">
        <input
          className="idea-input"
          value={theme}
          maxLength={60}
          placeholder="Type a theme (e.g. cricket)"
          onChange={(e) => setTheme(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
        />
        <button className="btn primary" onClick={() => generate()} disabled={loading || theme.trim().length < 2}>
          {loading ? "Thinking..." : "Generate idea"}
        </button>
      </div>

      <div className="idea-chips">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="chip"
            onClick={() => {
              setTheme(s);
              generate(s);
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="idea-err">{error}</p>}

      {idea && (
        <article className="idea-card" key={idea.title}>
          <h3>{idea.title}</h3>
          <p className="idea-hook">{idea.hook}</p>
          <ol>
            {idea.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
          <p><strong>Prize:</strong> {idea.prize}</p>
          <p><strong>Twist:</strong> {idea.twist}</p>
          <p className="idea-note">AI-generated fan concept, not an official idea.</p>
        </article>
      )}
    </div>
  );
}