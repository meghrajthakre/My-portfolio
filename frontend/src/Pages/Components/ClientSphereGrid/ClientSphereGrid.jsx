import { useEffect, useMemo, useRef, useState } from "react";

const C = "currentColor";

// Placeholder logos (original shapes). Replace with your own client SVGs.
const logos = [
  <svg viewBox="0 0 100 100" key="1"><circle cx="50" cy="50" r="30" fill="none" stroke={C} strokeWidth="9" /><circle cx="50" cy="50" r="9" fill={C} /></svg>,
  <svg viewBox="0 0 100 100" key="2"><polygon points="50,12 90,85 10,85" fill={C} /></svg>,
  <svg viewBox="0 0 100 100" key="3"><rect x="22" y="22" width="56" height="56" fill={C} transform="rotate(45 50 50)" /></svg>,
  <svg viewBox="0 0 100 100" key="4"><polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke={C} strokeWidth="8" /></svg>,
  <svg viewBox="0 0 100 100" key="5"><path d="M10 55 Q30 20 50 55 T90 55" fill="none" stroke={C} strokeWidth="9" strokeLinecap="round" /></svg>,
  <svg viewBox="0 0 100 100" key="6"><rect x="15" y="50" width="14" height="35" fill={C} /><rect x="38" y="30" width="14" height="55" fill={C} /><rect x="61" y="15" width="14" height="70" fill={C} /></svg>,
  <svg viewBox="0 0 100 100" key="7"><path d="M38 12h24v26h26v24H62v26H38V62H12V38h26z" fill={C} /></svg>,
  <svg viewBox="0 0 100 100" key="8"><path d="M15 20h70v45H48L30 85V65H15z" fill={C} /></svg>,
  <svg viewBox="0 0 100 100" key="9"><path d="M12 50h62M52 25l28 25-28 25" fill="none" stroke={C} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg viewBox="0 0 100 100" key="10"><path d="M50 88C20 70 15 35 50 12c35 23 30 58 0 76z" fill={C} /></svg>,
  <svg viewBox="0 0 160 60" key="11"><text x="80" y="42" textAnchor="middle" fontSize="34" fontWeight="800" letterSpacing="6" fill={C}>NOVA</text></svg>,
  <svg viewBox="0 0 160 60" key="12"><text x="80" y="42" textAnchor="middle" fontSize="30" fontStyle="italic" fontWeight="700" fill={C}>Brightly</text></svg>,
  <svg viewBox="0 0 160 60" key="13"><text x="80" y="40" textAnchor="middle" fontSize="26" fontWeight="500" letterSpacing="10" fill={C}>ZENITH</text></svg>,
  <svg viewBox="0 0 160 60" key="14"><text x="80" y="42" textAnchor="middle" fontSize="32" fontWeight="900" fill={C}>pixel.</text></svg>,
];

const COLS = 11; // odd => one column exactly in the center
const ROWS = 7; // odd => one row exactly in the center
const GAP = 4; // px between tiles

// ---- hover tuning ----
const NEAR_LIFT = 10; // px: how far the neighbourhood bulges toward you
const HOVER_LIFT = 24; // px: extra lift of the single hovered tile
const MAX_TILT = 4; // deg: hovered tile leans away from the pointer
const SMOOTH_NEAR = 0.14; // 0..1 lerp speed (higher = snappier)
const SMOOTH_HOVER = 0.18;

// ---- colors (rgb) ----
const BASE = [53, 8, 26];
const NEAR_BG = [92, 14, 44];
const WHITE = [255, 255, 255];
const PINK = [232, 51, 109];
const PINK_HOT = [255, 105, 160];
const INK = [14, 6, 10];

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (a, b, t) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function ClientSphereGrid() {
  const sectionRef = useRef(null);
  const tileRefs = useRef([]);
  const logoRefs = useRef([]);
  const pointerRef = useRef(null);
  const [size, setSize] = useState({ w: 1440, h: 800 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setSize({ w: width, h: height });
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Sphere geometry
  const R = Math.min(size.w, size.h) * 1.4;
  const perspective = size.w * 1.3;
  const pitchW = size.w / (COLS + 1);
  const pitchH = size.h / (ROWS + 2);
  const stepY = pitchW / R;
  const stepX = pitchH / R;
  const deg = (r) => (r * 180) / Math.PI;

  // Static per-tile data (incl. where each tile lands on screen)
  const tiles = useMemo(
    () =>
      Array.from({ length: COLS * ROWS }, (_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const yaw = deg((col - (COLS - 1) / 2) * stepY);
        const pitch = deg(-(row - (ROWS - 1) / 2) * stepX);
        const yawRad = (yaw * Math.PI) / 180;
        const pitchRad = (pitch * Math.PI) / 180;
        const x = R * Math.sin(yawRad) * Math.cos(pitchRad);
        const y = -R * Math.sin(pitchRad);
        const z = R * Math.cos(yawRad) * Math.cos(pitchRad) - R;
        const scale = perspective / (perspective - z);
        return {
          i,
          yaw,
          pitch,
          scale,
          cx: size.w / 2 + x * scale,
          cy: size.h / 2 + y * scale,
          logo: logos[(i * 3) % logos.length],
        };
      }),
    [R, perspective, size.w, size.h, stepX, stepY]
  );

  // Animation loop: lerped values live in refs, so no React re-render per frame
  const anim = useRef(
    Array.from({ length: COLS * ROWS }, () => ({ near: 0, h: 0, tx: 0, ty: 0 }))
  );

  useEffect(() => {
    let raf;
    const sigma = pitchW * 1.7; // radius of the "bulge" around the cursor

    const tick = () => {
      const ptr = pointerRef.current;

      // 1) find the ONE hovered tile = closest tile centre (in tile units)
      let hoveredIdx = -1;
      if (ptr) {
        let best = Infinity;
        for (const t of tiles) {
          const nx = (ptr.x - t.cx) / (pitchW * t.scale);
          const ny = (ptr.y - t.cy) / (pitchH * t.scale);
          const d = nx * nx + ny * ny;
          if (d < best) {
            best = d;
            hoveredIdx = t.i;
          }
        }
        if (best > 0.5) hoveredIdx = -1; // pointer is in a gap / outside
      }

      // 2) update + paint every tile
      for (const t of tiles) {
        const el = tileRefs.current[t.i];
        const logoEl = logoRefs.current[t.i];
        if (!el) continue;
        const s = anim.current[t.i];

        const d2 = ptr ? (ptr.x - t.cx) ** 2 + (ptr.y - t.cy) ** 2 : Infinity;
        const nearTarget = ptr ? Math.exp(-d2 / (sigma * sigma)) : 0;
        const isHovered = t.i === hoveredIdx;

        s.near = lerp(s.near, nearTarget, SMOOTH_NEAR);
        s.h = lerp(s.h, isHovered ? 1 : 0, SMOOTH_HOVER);

        const txTarget = isHovered ? clamp((ptr.x - t.cx) / (pitchW * t.scale * 0.5), -1, 1) : 0;
        const tyTarget = isHovered ? clamp((ptr.y - t.cy) / (pitchH * t.scale * 0.5), -1, 1) : 0;
        s.tx = lerp(s.tx, txTarget, 0.2);
        s.ty = lerp(s.ty, tyTarget, 0.2);

        el.style.transform =
          `rotateY(${t.yaw}deg) rotateX(${t.pitch}deg) ` +
          `translateZ(${R + s.near * NEAR_LIFT + s.h * HOVER_LIFT}px) ` +
          `rotateX(${-s.ty * MAX_TILT * s.h}deg) rotateY(${s.tx * MAX_TILT * s.h}deg) ` +
          `scale(${1 + s.h * 0.015})`;

        // bg: base -> warmer near the cursor -> white on hover
        const bg = mix(mix_(BASE, NEAR_BG, s.near), WHITE, s.h);
        el.style.backgroundColor = bg;
        // logo: pink -> hot pink near the cursor -> ink on hover
        el.style.color = mix(mix_(PINK, PINK_HOT, s.near), INK, s.h);
        el.style.boxShadow =
          s.h > 0.01
            ? `0 0 ${Math.round(s.h * 46)}px rgba(232,51,109,${(s.h * 0.55).toFixed(3)})`
            : "none";
        el.style.zIndex = isHovered ? 5 : 0;

        if (logoEl) logoEl.style.transform = `scale(${1 + s.h * 0.06})`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tiles, pitchW, pitchH, R]);

  return (
    <section
      ref={sectionRef}
      className="relative aspect-[16/9] min-h-[24rem] max-h-[48rem] w-full overflow-hidden bg-[#1a030a] text-white"
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        pointerRef.current = { x: e.clientX - b.left, y: e.clientY - b.top };
      }}
      onPointerLeave={() => {
        pointerRef.current = null;
      }}
    >
      {/* 3D stage */}
      <div className="absolute inset-0" style={{ perspective: `${perspective}px` }}>
        <div
          className="absolute left-1/2 top-1/2"
          style={{ transformStyle: "preserve-3d", transform: `translateZ(${-R}px)` }}
        >
          {tiles.map(({ i, yaw, pitch, logo }) => (
            <div
              key={i}
              ref={(el) => (tileRefs.current[i] = el)}
              className="pointer-events-none absolute flex items-center justify-center overflow-hidden will-change-transform"
              style={{
                width: pitchW - GAP,
                height: pitchH - GAP,
                left: -(pitchW - GAP) / 2,
                top: -(pitchH - GAP) / 2,
                backfaceVisibility: "hidden",
                backgroundColor: "rgb(53,8,26)",
                color: "rgb(232,51,109)",
                transform: `rotateY(${yaw}deg) rotateX(${pitch}deg) translateZ(${R}px)`,
              }}
            >
              <div
                ref={(el) => (logoRefs.current[i] = el)}
                className="h-1/2 w-1/2 [&>svg]:h-full [&>svg]:w-full"
              >
                {logo}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.6)_100%)]" />
    </section>
  );
}

// helper: rgb-array mix (returns an array, used for chaining two mixes)
function mix_(a, b, t) {
  return a.map((v, i) => lerp(v, b[i], t));
}
