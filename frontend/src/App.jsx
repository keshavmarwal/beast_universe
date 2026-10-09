import Cursor from "./components/Cursor.jsx";
import Feastables from "./components/Feastables.jsx";
import Reels from "./components/Reels.jsx";
import Arena from "./components/Arena.jsx";

const HEADLINE = ["Built", "for", "the", "Beast", "universe."];

export default function App() {
  return (
    <>
      <Cursor />

      <nav className="nav" data-cursor="default">
        <a className="nav-brand" href="#top">Beast Universe</a>
        <div className="nav-links">
          <a href="#feastables">Feastables</a>
          <a href="#arena">Arena</a>
          <a href="#shorts">Shorts</a>
        </div>
      </nav>

      <header className="hero" id="top" data-cursor="default">
        <h1 aria-label={HEADLINE.join(" ")}>
          {HEADLINE.map((w, i) => (
            <span className="w" aria-hidden="true" style={{ "--i": i }} key={w}>
              {w}
            </span>
          ))}
        </h1>
        <p className="pitch">
          Maine ye tumhare liye banaya: ek universe jisme har product ka apna
          world hai. Live voting, 3D, aur real-time data, sab ek jagah.
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="#arena">Play the arena</a>
          <button className="btn ghost" disabled title="Intro video coming soon">
            Watch my intro (soon)
          </button>
        </div>
        <p className="fan-note">A fan-made concept by Keshav</p>
      </header>

      <div id="feastables">
        <Feastables />
      </div>

      <section className="panel games" id="arena" data-cursor="games">
        <h2>Beast Games arena</h2>
        <Arena />
      </section>

      <div id="shorts">
        <Reels />
      </div>

      <footer data-cursor="default">
        Unofficial fan project, not affiliated with MrBeast or his companies.
      </footer>
    </>
  );
}