import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import BarAR from "./BarAR.jsx";

// Placeholder flavors: apne naam, colors aur lines yahan badal sakta hai.
const FLAVORS = [
  { id: "crunch", name: "Milk Crunch", color: "#ffd400", tint: "#fff3b0", blurb: "Smooth milk chocolate with a loud crunch." },
  { id: "dark", name: "Midnight Dark", color: "#5a3a28", tint: "#e3d0c2", blurb: "Deep, bold and just a little bit dangerous." },
  { id: "mint", name: "Mint Cool", color: "#2ec4a6", tint: "#cdf5ec", blurb: "Fresh mint that hits like a reset button." },
  { id: "berry", name: "Berry Blast", color: "#e63e6d", tint: "#ffd6e0", blurb: "Tangy berry swirl, zero chill." },
  { id: "caramel", name: "Caramel Gold", color: "#d98e2b", tint: "#ffe4bd", blurb: "Gooey caramel in every single bite." },
];

const COLS = [-0.39, 0.39];
const ROWS = [-1.125, -0.375, 0.375, 1.125];

function Bar({ color }) {
  const group = useRef();
  const target = useMemo(() => new THREE.Color(color), []);
  target.set(color);

  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.38,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      }),
    []
  );

  useFrame((state, dt) => {
    mat.color.lerp(target, 1 - Math.exp(-dt * 6));
    const t = state.clock.elapsedTime;
    const ry = Math.sin(t * 0.5) * 0.35 + state.pointer.x * 0.6 + window.scrollY * 0.0015;
    const rx = 0.1 - state.pointer.y * 0.3;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ry, 4, dt);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, rx, 4, dt);
  });

  return (
    <group ref={group}>
      <RoundedBox args={[1.7, 3.1, 0.18]} radius={0.06} smoothness={4}>
        <primitive object={mat} attach="material" />
      </RoundedBox>
      {ROWS.flatMap((y) =>
        COLS.map((x) => (
          <RoundedBox
            key={`${x}-${y}`}
            args={[0.74, 0.66, 0.16]}
            position={[x, y, 0.12]}
            radius={0.07}
            smoothness={4}
          >
            <primitive object={mat} attach="material" />
          </RoundedBox>
        ))
      )}
    </group>
  );
}

function Crumbs({ burstKey, color }) {
  const group = useRef();
  const data = useMemo(
    () => Array.from({ length: 28 }, () => ({ v: new THREE.Vector3(), life: 0 })),
    []
  );

  useEffect(() => {
    data.forEach((d, i) => {
      d.v.set((Math.random() - 0.5) * 3, Math.random() * 2.5 + 0.5, (Math.random() - 0.2) * 3);
      d.life = 1;
      const m = group.current.children[i];
      m.position.set(0, 0, 0.3);
    });
  }, [burstKey]);

  useFrame((_, dt) => {
    data.forEach((d, i) => {
      const m = group.current.children[i];
      if (d.life <= 0) {
        m.visible = false;
        return;
      }
      m.visible = true;
      d.v.y -= 6 * dt;
      m.position.addScaledVector(d.v, dt);
      m.rotation.x += dt * 6;
      m.rotation.y += dt * 4;
      d.life -= dt * 0.9;
      m.scale.setScalar(Math.max(d.life, 0));
    });
  });

  return (
    <group ref={group}>
      {data.map((_, i) => (
        <mesh key={i} visible={false}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

export default function Feastables() {
  const [active, setActive] = useState(FLAVORS[0]);
  const [burst, setBurst] = useState(0);
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(([en]) => setVisible(en.isIntersecting));
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);
  function pick(f) {
    setActive(f);
    setBurst((b) => b + 1);
  }

  return (
    <section
      className="panel feastables"
      data-cursor="feastables"
      style={{ "--tint": active.tint }}
    >
      <div>
        <h2>Feastables</h2>
        <p>Move your mouse or scroll, the bar reacts. Pick a flavor and watch it change.</p>

        <div className="chips" role="group" aria-label="Flavors">
          {FLAVORS.map((f) => (
            <button
              key={f.id}
              className={`chip ${f.id === active.id ? "on" : ""}`}
              aria-pressed={f.id === active.id}
              onClick={() => pick(f)}
            >
              <span className="swatch" style={{ background: f.color }} />
              {f.name}
            </button>
          ))}
        </div>

        <p className="blurb" key={active.id}>{active.blurb}</p>
      </div>

      <div className="stage">
        <div className="canvas-wrap" ref={wrapRef}>
          <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0, 5.4], fov: 42 }}>
            <Environment resolution={256}>
              <Lightformer form="rect" intensity={4} position={[0, 5, -5]} scale={[10, 10, 1]} />
              <Lightformer form="rect" intensity={2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
              <Lightformer form="rect" intensity={2} position={[5, -1, 2]} scale={[10, 2, 1]} />
            </Environment>
            <directionalLight position={[3, 4, 5]} intensity={1.1} />
            <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.5}>
              <Bar color={active.color} />
            </Float>
            <Crumbs burstKey={burst} color={active.color} />
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={8} blur={2.5} far={4} />
          </Canvas>
        </div>

        <div className="ar-box">
          <p className="ar-title">Try it in AR</p>
          <BarAR color={active.color} />
        </div>
      </div>
    </section>
  );
}