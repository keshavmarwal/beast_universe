import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Real-size chocolate bar (meters), lying flat: 7cm x 16cm, ~1.3cm thick.
function buildBar(color) {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
  const group = new THREE.Group();

  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.008, 0.16), mat);
  slab.position.y = 0.004;
  group.add(slab);

  for (let x = 0; x < 2; x++) {
    for (let z = 0; z < 4; z++) {
      const square = new THREE.Mesh(new THREE.BoxGeometry(0.029, 0.005, 0.034), mat);
      square.position.set(-0.0165 + x * 0.033, 0.0105, -0.06 + z * 0.04);
      group.add(square);
    }
  }
  return group;
}

function exportGlb(color) {
  return new Promise((resolve, reject) => {
    new GLTFExporter().parse(
      buildBar(color),
      (buffer) =>
        resolve(URL.createObjectURL(new Blob([buffer], { type: "model/gltf-binary" }))),
      reject,
      { binary: true }
    );
  });
}

export default function BarAR({ color }) {
  const [ready, setReady] = useState(false);
  const [src, setSrc] = useState(null);

  // load the viewer only when this section mounts (keeps first load light)
  useEffect(() => {
    import("@google/model-viewer").then(() => setReady(true));
  }, []);

  useEffect(() => {
    let url;
    let cancelled = false;
    exportGlb(color).then((u) => {
      if (cancelled) return URL.revokeObjectURL(u);
      url = u;
      setSrc(u);
    });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [color]);

  if (!ready || !src) return null;

  return (
    <model-viewer
      src={src}
      alt="3D chocolate bar"
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      style={{ width: "100%", height: "300px" }}
    >
      <button slot="ar-button" className="btn primary ar-btn">
        View in your room (AR)
      </button>
    </model-viewer>
  );
}