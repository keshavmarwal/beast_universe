import { useEffect } from "react";
import Lenis from "lenis";

// const REVEAL = ".panel h2, .panel > p, .chips, .stage, .pl, .feed, .hero-actions";
const REVEAL = ".panel h2, .panel > p, .chips, .stage, .pl, .impact, .feed, .hero-actions";
export default function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("js-motion");

    // smooth scrolling
    const lenis = new Lenis({ lerp: 0.1 });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // scroll position as a CSS variable (used for hero parallax)
    const onScroll = () =>
      root.style.setProperty("--sy", String(Math.min(window.scrollY, 1200)));
    lenis.on("scroll", onScroll);
    onScroll();

    // nav links: smooth jump to sections
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      const href = a?.getAttribute("href");
      if (!href || href.length < 2) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -64 });
    };
    document.addEventListener("click", onClick);

    // reveal on scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(REVEAL).forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      io.disconnect();
      document.removeEventListener("click", onClick);
      root.classList.remove("js-motion");
    };
  }, []);

  return null;
}