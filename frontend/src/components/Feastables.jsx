import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function Bar() {
  const ref = useRef();
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.5; });
  return (
    <mesh ref={ref} rotation={[0.4, 0, 0.1]}>
      <boxGeometry args={[1.6, 3, 0.25]} />
      <meshStandardMaterial color="#ffd400" roughness={0.35} />
    </mesh>
  );
}

export default function Feastables() {
  return (
    <section className="panel feastables" data-cursor="feastables">
      <div>
        <h2>Feastables</h2>
        <p>Drag the bar to spin it. Flavor explorer and AR try-on come next.</p>
      </div>
      <div className="canvas-wrap">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} />
          <Bar />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </section>
  );
}
