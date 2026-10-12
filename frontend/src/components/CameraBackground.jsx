import { useEffect, useRef, useState } from "react";

export default function CameraBackground() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [on, setOn] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera is not supported here (it needs HTTPS or localhost).");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setOn(true);
      document.body.classList.add("cam-on");
    } catch {
      setError("Camera permission was denied, or no camera was found.");
    }
  }

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setOn(false);
    document.body.classList.remove("cam-on");
  }

  useEffect(() => stop, []);

  return (
    <>
      <video
        ref={videoRef}
        className={`cam-video ${on ? "on" : ""}`}
        playsInline
        muted
        aria-hidden="true"
      />
      <div className="cam-ui">
        <button className="btn primary cam-btn" onClick={on ? stop : start}>
          {on ? "Turn camera off" : "📷 Camera background"}
        </button>
        {error && <p className="cam-err">{error}</p>}
      </div>
    </>
  );
}