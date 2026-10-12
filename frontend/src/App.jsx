import { lazy, Suspense } from "react";
import Cursor from "./components/Cursor.jsx";
// import Feastables from "./components/Feastables.jsx";
import Reels from "./components/Reels.jsx";
import Arena from "./components/Arena.jsx";
import Stats from "./components/Stats.jsx";
import Playlist from "./components/Playlist.jsx";
import CameraBackground from "./components/CameraBackground.jsx";
import Motion from "./components/Motion.jsx";
// import HeroScene from "./components/HeroScene.jsx";
import ImpactMap from "./components/ImpactMap.jsx";
const HEADLINE = ["Built", "for", "the", "Beast", "universe."];


const Feastables = lazy(() => import("./components/Feastables.jsx"));
const HeroScene = lazy(() => import("./components/HeroScene.jsx"));
export default function App() {
  return (
    <>
      <Cursor />
      <Motion />
      <CameraBackground />
      <nav className="nav" data-cursor="default">
        <a className="nav-brand" href="#top">Beast Universe</a>
        <div className="nav-links">
          <a href="#feastables">Feastables</a>
          <a href="#arena">Arena</a>
          <a href="#shorts">Shorts</a>
          <a href="#playlist">Playlist</a>
          <a href="#impact">Impact</a>
        </div>
      </nav>

      <header className="hero" id="top" data-cursor="default">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
        
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
        <Stats />
        <p className="fan-note">A fan-made concept by Keshav</p>
      </header>

      <div id="feastables">
        <Suspense fallback={<section className="panel feastables" style={{ minHeight: 520 }} />}>
          <Feastables />
        </Suspense>
      </div>

      <section className="panel games" id="arena" data-cursor="games">
        <h2>Beast Games arena</h2>
        <Arena />
      </section>
      <section className="panel playlist-panel" id="playlist" data-cursor="playlist">
        <h2>The playlist</h2>
        <p>Tracks that fit the universe. Pick one and hit play.</p>
        <Playlist />
      </section>
      <section className="panel impact-panel" id="impact" data-cursor="impact">
        <h2>Impact map</h2>
        <p>Where the good stuff happens. Tap a pin to see the project.</p>
        <ImpactMap />
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