import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

// Placeholder flavors: apne naam, colors aur lines yahan badal sakta hai.
const FLAVORS = [
  { id: "crunch", name: "Milk Crunch", color: "#ffd400", tint: "#fff3b0", blurb: "Smooth milk chocolate with a loud crunch." },
  { id: "dark", name: "Midnight Dark", color: "#5a3a28", tint: "#e3d0c2", blurb: "Deep, bold and just a little bit dangerous." },
  { id: "mint", name: "Mint Cool", color: "#2ec4a6", tint: "#cdf5ec", blurb: "Fresh mint that hits like a reset button." },
  { id: "berry", name: "Berry Blast", color: "#e63e6d", tint: "#ffd6e0", blurb: "Tangy berry swirl, zero chill." },
  { id: "caramel", name: "Caramel Gold", color: "#d98e2b", tint: "#ffe4bd", blurb: "Gooey caramel in every single bite." },
];

function Bar({ color }) {
  const mesh = useRef();
  const target = useRef(new THREE.Color(color));
  target.current.set(color);

  useFrame((_, dt) => {
    mesh.current.rotation.y += dt * 0.5;
    mesh.current.material.color.lerp(target.current, 1 - Math.exp(-dt * 6));
  });

  return (
    <mesh ref={mesh} rotation={[0.4, 0, 0.1]}>
      <boxGeometry args={[1.6, 3, 0.25]} />
      <meshStandardMaterial color="#ffd400" roughness={0.35} />
    </mesh>
  );
}

export default function Feastables() {
  const [active, setActive] = useState(FLAVORS[0]);

  return (
    <section
      className="panel feastables"
      data-cursor="feastables"
      style={{ "--tint": active.tint }}
    >
      <div>
        <h2>Feastables</h2>
        <p>Drag the bar to spin it. Pick a flavor and watch it change.</p>

        <div className="chips" role="group" aria-label="Flavors">
          {FLAVORS.map((f) => (
            <button
              key={f.id}
              className={`chip ${f.id === active.id ? "on" : ""}`}
              aria-pressed={f.id === active.id}
              onClick={() => setActive(f)}
            >
              <span className="swatch" style={{ background: f.color }} />
              {f.name}
            </button>
          ))}
        </div>

        <p className="blurb" key={active.id}>{active.blurb}</p>
      </div>

      <div className="canvas-wrap">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} />
          <Bar color={active.color} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </section>
  );
}