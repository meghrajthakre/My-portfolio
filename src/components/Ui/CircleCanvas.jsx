import { useCallback, useEffect, useRef } from "react";

const CircleCanvas = ({ isDark }) => {
  const canvasRef = useRef(null);
  const circleCenter = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animationFrameId = useRef(null);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    const targetRadius = Math.hypot(window.innerWidth, window.innerHeight);
    let startTime;

    const render = (timestamp) => {
      startTime ??= timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / 800, 1);
      const eased = progress < 0.5
        ? 4 * progress ** 3
        : 1 - ((-2 * progress + 2) ** 3) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(circleCenter.current.x, circleCenter.current.y, targetRadius * eased, 0, 2 * Math.PI);
      ctx.fillStyle = isDark ? "#fff" : "#111";
      ctx.fill();

      if (progress < 1) animationFrameId.current = requestAnimationFrame(render);
    };

    cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = requestAnimationFrame(render);
  }, [isDark]);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const handleToggle = (event) => {
      circleCenter.current = event.detail;
      startAnimation();
    };
    window.addEventListener("darkModeToggle", handleToggle);
    return () => window.removeEventListener("darkModeToggle", handleToggle);
  }, [startAnimation]);

  useEffect(() => () => cancelAnimationFrame(animationFrameId.current), []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-screen w-screen pointer-events-none"
      style={{ background: isDark ? "#111" : "#fff", transition: "background 0.8s ease-in-out" }}
    />
  );
};

export default CircleCanvas;
