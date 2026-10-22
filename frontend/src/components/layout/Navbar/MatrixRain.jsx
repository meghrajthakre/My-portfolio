import { useEffect, useRef } from "react";

const FADE_MS = 800;

// Half-width katakana + digits + a few symbols, like the film's glyph set
const GLYPHS = Array.from({ length: 56 }, (_, i) => String.fromCharCode(0xff66 + i)).join("") + '0123456789Z:・."=*+-<>';
const GLYPH_COUNT = GLYPHS.length;

const COLORS = { base: "#19e050", bright: "#a8ffc0", head: "#ffffff" };

// Three depth layers: small/slow/dim in the back, large/fast/bright in front
const LAYERS = [
  { size: 10, alpha: 0.4, density: 0.55, speed: [5, 10], length: [10, 22] },
  { size: 14, alpha: 0.7, density: 0.5, speed: [8, 15], length: [12, 28] },
  { size: 20, alpha: 1, density: 0.3, speed: [11, 20], length: [14, 34] },
];

const rand = (min, max) => min + Math.random() * (max - min);
const randomGlyph = () => Math.floor(Math.random() * GLYPH_COUNT);

// Pre-renders every glyph once (mirrored, as in the film) so each frame is just fast drawImage calls
const buildAtlas = (cell, color) => {
  const atlas = document.createElement("canvas");
  atlas.width = cell * GLYPH_COUNT;
  atlas.height = cell;
  const g = atlas.getContext("2d");
  g.font = `${Math.floor(cell * 0.9)}px "MS Gothic", "Hiragino Kaku Gothic Pro", "Noto Sans JP", monospace`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = color;
  for (let i = 0; i < GLYPH_COUNT; i += 1) {
    g.save();
    g.translate(i * cell + cell / 2, cell / 2);
    g.scale(-1, 1);
    g.fillText(GLYPHS[i], 0, 0);
    g.restore();
  }
  return atlas;
};

const MatrixRain = ({ onDone, duration = 12000 }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const onDoneRef = useRef(onDone);

  // Latest callback without restarting the animation on parent re-renders
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrapper || !canvas || !ctx) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = [];
    let frameId = 0;
    let resizeTimer = 0;
    let lastTime = 0;
    let finished = false;
    let width = 0;
    let height = 0;
    let layers = [];

    // A stream is one falling column: glyphs[0] is the head, the rest is the trail behind it
    const makeStream = (layer, column, initial) => {
      const length = Math.floor(rand(layer.length[0], layer.length[1]));
      return {
        column,
        length,
        speed: rand(layer.speed[0], layer.speed[1]), // rows per second
        acc: 0,
        row: -Math.floor(rand(1, initial ? layer.rows * 1.1 : layer.rows * 0.5)), // head row (negative = above screen)
        glyphs: Array.from({ length }, randomGlyph),
      };
    };

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      layers = LAYERS.map((def) => {
        const cell = Math.ceil(def.size * dpr);
        const layer = {
          ...def,
          cell,
          rows: Math.ceil(height / def.size),
          atlases: {
            base: buildAtlas(cell, COLORS.base),
            bright: buildAtlas(cell, COLORS.bright),
            head: buildAtlas(cell, COLORS.head),
          },
          streams: [],
        };
        const columns = Math.ceil(width / def.size);
        for (let column = 0; column < columns; column += 1) {
          if (Math.random() < def.density) layer.streams.push(makeStream(layer, column, true));
        }
        return layer;
      });
    };

    const update = (layer, stream, dt) => {
      // The head snaps cell by cell, so the motion looks like a terminal grid, not smooth scrolling
      stream.acc += stream.speed * dt;
      while (stream.acc >= 1) {
        stream.acc -= 1;
        stream.row += 1;
        stream.glyphs.unshift(randomGlyph());
        stream.glyphs.pop();
      }
      // Glyphs in the trail randomly change as the stream falls
      if (stream.length > 1 && Math.random() < 0.1) {
        stream.glyphs[1 + Math.floor(Math.random() * (stream.length - 1))] = randomGlyph();
      }
      if (stream.row - stream.length > layer.rows) Object.assign(stream, makeStream(layer, stream.column, false));
    };

    const drawLayer = (layer) => {
      const { size, cell, rows, alpha, atlases, streams } = layer;

      // Trails: bright green near the head, fading to nothing at the tail
      for (const stream of streams) {
        const x = stream.column * size;
        for (let i = stream.length - 1; i >= 1; i -= 1) {
          const row = stream.row - i;
          if (row < 0 || row >= rows) continue;
          ctx.globalAlpha = alpha * Math.pow(1 - i / stream.length, 1.6);
          ctx.drawImage(i <= 2 ? atlases.bright : atlases.base, stream.glyphs[0 + i] * cell, 0, cell, cell, x, row * size, size, size);
        }
      }

      // Heads: white with a green glow
      ctx.shadowColor = COLORS.base;
      ctx.shadowBlur = size * 0.8;
      ctx.globalAlpha = alpha;
      for (const stream of streams) {
        if (stream.row < 0 || stream.row >= rows) continue;
        ctx.drawImage(atlases.head, stream.glyphs[0] * cell, 0, cell, cell, stream.column * size, stream.row * size, size, size);
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      layers.forEach(drawLayer);
    };

    const frame = (timestamp) => {
      const dt = Math.min((timestamp - (lastTime || timestamp)) / 1000, 0.1);
      lastTime = timestamp;
      layers.forEach((layer) => layer.streams.forEach((stream) => update(layer, stream, dt)));
      drawFrame();
      frameId = window.requestAnimationFrame(frame);
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      wrapper.style.opacity = "0";
      timers.push(window.setTimeout(() => onDoneRef.current?.(), FADE_MS));
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") finish();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        if (reducedMotion) layers.forEach((layer) => layer.streams.forEach((stream) => (stream.row = Math.floor(rand(0, layer.rows)))));
        if (reducedMotion) drawFrame();
      }, 150);
    };

    setup();
    if (reducedMotion) {
      // One still frame instead of animation
      layers.forEach((layer) => layer.streams.forEach((stream) => (stream.row = Math.floor(rand(0, layer.rows)))));
      drawFrame();
    } else {
      frameId = window.requestAnimationFrame(frame);
    }

    // Fade in, then fade out shortly before the duration ends
    timers.push(window.setTimeout(() => (wrapper.style.opacity = "1"), 30));
    timers.push(window.setTimeout(finish, Math.max(0, duration - FADE_MS)));

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(resizeTimer);
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [duration]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        opacity: 0,
        transition: `opacity ${FADE_MS}ms ease`,
        // Dark green-tinted backdrop with a vignette, so the rain reads like the real thing
        background: "radial-gradient(ellipse at center, rgba(0, 10, 3, 0.5) 0%, rgba(0, 0, 0, 0.82) 100%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default MatrixRain;