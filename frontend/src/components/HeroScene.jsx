import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const COLORS = ["#ffd400", "#ffffff", "#7fa0ff", "#ffd400", "#ffffff"];

// small seeded random so shapes don't jump around on re-render
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Shape({ s }) {
  return (
    <Float speed={s.speed} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh position={s.pos} scale={s.scale} rotation={s.rot}>
        {s.kind === 0 && <icosahedronGeometry args={[1, 0]} />}
        {s.kind === 1 && <torusGeometry args={[0.8, 0.3, 16, 40]} />}
        {s.kind === 2 && <octahedronGeometry args={[1, 0]} />}
        {s.kind === 3 && <boxGeometry args={[1.2, 1.2, 1.2]} />}
        <meshStandardMaterial color={s.color} roughness={0.25} metalness={0.2} />
      </mesh>
    </Float>
  );
}

function Scene({ mouse }) {
  const { viewport } = useThree();
  const group = useRef();

  const shapes = useMemo(() => {
    const r = rng(7);
    const count = viewport.width < 6 ? 8 : 14;
    return Array.from({ length: count }, (_, i) => ({
      kind: Math.floor(r() * 4),
      color: COLORS[i % COLORS.length],
      // biased to the right so the headline on the left stays readable
      pos: [
        (r() * 0.8 - 0.1) * viewport.width,
        (r() - 0.5) * viewport.height * 0.9,
        r() * -4 + 0.5,
      ],
      scale: 0.3 + r() * 0.5,
      rot: [r() * 3, r() * 3, 0],
      speed: 0.8 + r() * 1.4,
    }));
  }, [viewport.width, viewport.height]);

  useFrame((_, dt) => {
    const g = group.current;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, mouse.current.x * 0.3, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -mouse.current.y * 0.2, 3, dt);
    g.position.y = window.scrollY * 0.004;
  });

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <Shape s={s} key={i} />
      ))}
    </group>
  );
}

export default function HeroScene() {
  const wrap = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [enabled] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    // stop rendering when the hero is off-screen (saves battery/GPU)
    const io = new IntersectionObserver(([en]) => setVisible(en.isIntersecting));
    io.observe(wrap.current);
    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrap} className="hero-scene" aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 5, 6]} intensity={1.6} />
        <pointLight position={[-5, -2, 3]} intensity={12} color="#7fa0ff" />
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}