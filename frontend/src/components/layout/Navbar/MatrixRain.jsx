import { useEffect, useRef } from "react";

const GLYPHS = "アカサタナハマヤラワ012345789";
const DURATION_MS = 1000000;

const MatrixRain = ({ onDone }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const fontSize = 14;
    let drops = [];
    let frameId;
    let lastFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array.from({ length: Math.ceil(canvas.width / fontSize) }, () => Math.random() * -30);
    };

    const draw = (timestamp = 0) => {
      if (!reducedMotion && timestamp - lastFrame < 70) {
        frameId = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;
      context.fillStyle = "rgba(0, 0, 0, 0.08)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#39ff75";
      context.font = `${fontSize}px monospace`;

      drops.forEach((drop, column) => {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const y = drop * fontSize;
        context.fillText(glyph, column * fontSize, y);
        if (y > canvas.height && Math.random() > 0.975) drops[column] = 0;
        else if (!reducedMotion) drops[column] += 0.35 + Math.random() * 0.3;
      });

      if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();
    if (!reducedMotion) window.addEventListener("resize", resizeCanvas);
    const timerId = window.setTimeout(onDone, DURATION_MS);

    return () => {
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [onDone]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-20 mix-blend-screen" />;
};

export default MatrixRain;
