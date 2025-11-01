import React, { useEffect, useRef } from "react";

const CircleCanvas = ({ isDark }) => {
  const canvasRef = useRef(null);
  const circleCenter = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const animationFrameId = useRef(null);

  // 🧠 Helper to update canvas size properly (with DPR)
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    // update canvas size for HDPI displays
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any scale
    ctx.scale(dpr, dpr);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", resizeCanvas); // ✅ Fix scroll issue too
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const handleToggle = (event) => {
      circleCenter.current = event.detail;
      startAnimation();
    };

    window.addEventListener("darkModeToggle", handleToggle);
    return () => window.removeEventListener("darkModeToggle", handleToggle);
  }, [isDark]);

  const startAnimation = () => {
    const ctx = canvasRef.current.getContext("2d");
    const targetRadius = Math.sqrt(
      window.innerWidth ** 2 + window.innerHeight ** 2
    );
    let startTime = null;
    const duration = 1200; // smoother transition

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);

      // ease-in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const currentRadius = targetRadius * eased;

      // clear canvas each frame
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // draw expanding circle
      ctx.beginPath();
      ctx.arc(
        circleCenter.current.x,
        circleCenter.current.y,
        currentRadius,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = isDark ? "#fff" : "#111";
      ctx.fill();

      if (elapsed < duration) {
        animationFrameId.current = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId.current);
      }
    };

    cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = requestAnimationFrame(render);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        background: isDark ? "#111" : "#fff",
        transition: "background 1s ease-in-out",
      }}
    />
  );
};

export default CircleCanvas;
