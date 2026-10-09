import Cursor from "./components/Cursor.jsx";
import Feastables from "./components/Feastables.jsx";
import Reels from "./components/Reels.jsx";
import Arena from "./components/Arena.jsx";
export default function App() {
  return (
    <>
      <Cursor />
      <header className="hero" data-cursor="default">
        <h1>Built for the<br />Beast universe.</h1>
        <p>A fan-made concept by Keshav: every product gets its own world. Move your cursor and watch it change.</p>
      </header>
      <Feastables />
      <section className="panel games" data-cursor="games">
        <h2>Beast Games arena</h2>
        <Arena />
      </section>
      <Reels />
      <footer data-cursor="default">Unofficial fan project, not affiliated with MrBeast or his companies.</footer>
    </>
  );
}
