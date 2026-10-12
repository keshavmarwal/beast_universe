import { useState } from "react";
import "./Playlist.css";

const TRACKS = [
  { title: "End of Beginning", artist: "Djo", youtubeId: "xy3AcmW0lrQ" },
  { title: "Delete Ya", artist: "Djo", youtubeId: "rBXRMEZCNJA" },
  { title: "Basic Being Basic", artist: "Djo", youtubeId: "https://www.youtube.com/results?search_query=Djo+Basic+Being+Basic" },
  { title: "Chateau (Feel Alright)", artist: "Djo", youtubeId: "https://www.youtube.com/results?search_query=Djo+Chateau+Feel+Alright" },
  { title: "Roddy", artist: "Djo", youtubeId: "https://www.youtube.com/results?search_query=Djo+Roddy+official" },
  { title: "Waka Waka (This Time for Africa)", artist: "Shakira", youtubeId: "pRpeEdMmmQ0" },
  { title: "Hips Don't Lie", artist: "Shakira", youtubeId: "DUT5rEU6pqM" },
  { title: "Whenever, Wherever", artist: "Shakira", youtubeId: "weRHyjj34ZE" },
  { title: "She Wolf", artist: "Shakira", youtubeId: "booKP974B0k" },
  { title: "La La La (Brazil 2014)", artist: "Shakira", youtubeId: "https://www.youtube.com/results?search_query=Shakira+La+La+La+Brazil+2014+official" },
  { title: "Beautiful Liar", artist: "Beyoncé, Shakira", youtubeId: "https://www.youtube.com/results?search_query=Beyonce+Shakira+Beautiful+Liar+official" },
];

const isVideoId = (v) => /^[a-zA-Z0-9_-]{11}$/.test(v);

export default function Playlist() {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const track = TRACKS[index];
  const playable = isVideoId(track.youtubeId);
  const link = track.youtubeId.startsWith("https://www.youtube.com/")
    ? track.youtubeId
    : null;

  function pick(i) {
    setIndex(i);
    setStarted(true);
  }

  return (
    <div className="pl">
      <section className="pl-list">
        <div className="pl-list-head">
          <h3>Tracklist</h3>
          <span className="pl-count">{TRACKS.length} songs</span>
        </div>

        {/* data-lenis-prevent: smooth-scroll library is list ke andar scroll na roke */}
        <ol className="pl-tracks" data-lenis-prevent>
          {TRACKS.map((t, i) => (
            <li key={t.title}>
              <button
                type="button"
                className={`pl-track ${i === index && started ? "on" : ""}`}
                onClick={() => pick(i)}
              >
                <span className="pl-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="pl-meta">
                  <span className="pl-title">{t.title}</span>
                  <span className="pl-artist">{t.artist}</span>
                </span>
                <span className="pl-icon" aria-hidden="true">
                  {i === index && started ? "♫" : "▶"}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="pl-player">
        <div className="pl-now">
          <div className={`pl-vinyl ${started && playable ? "spin" : ""}`} aria-hidden="true">
            <div className="pl-vinyl-label">{String(index + 1).padStart(2, "0")}</div>
          </div>

          <div className="pl-info">
            <span className="pl-status">
              <i className={`pl-dot ${started ? "on" : ""}`} />
              {started ? "Now selected" : "Ready to play"}
            </span>
            <h3>{started ? track.title : "Pick a track"}</h3>
            <p>{started ? track.artist : "Choose a song from the list."}</p>

            <div className={`pl-eq ${started && playable ? "on" : ""}`} aria-hidden="true">
              {Array.from({ length: 7 }).map((_, n) => (
                <span key={n} style={{ "--n": n }} />
              ))}
            </div>
          </div>
        </div>

        {started && playable && (
          <div className="pl-video">
            <iframe
              key={track.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${track.youtubeId}?autoplay=1&rel=0`}
              title={track.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {started && !playable && (
          <p className="pl-hint">
            This track needs a valid YouTube video ID.{" "}
            {link && (
              <a href={link} target="_blank" rel="noreferrer">
                Find song ↗
              </a>
            )}
          </p>
        )}
      </section>
    </div>
  );
}