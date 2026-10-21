import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { THEMES } from "./profileFlowerThemes.js";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const TAU = Math.PI * 2;
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
// t > 0 lightens toward white, t < 0 darkens toward black
const mix = (hex, t) => {
  const [r, g, b] = rgb(hex);
  const to = t > 0 ? 255 : 0;
  const k = Math.abs(t);
  return `rgb(${Math.round(r + (to - r) * k)},${Math.round(g + (to - g) * k)},${Math.round(b + (to - b) * k)})`;
};
const rgba = (hex, a) => {
  const [r, g, b] = rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};
// Fake 3D flip: squash along Y by the tilt value, never fully flat so the shape doesn't vanish.
const flip = (c, tilt) => c.scale(1, (tilt < 0 ? -1 : 1) * Math.max(0.1, Math.abs(tilt)));
const weighted = (items) => {
  let total = 0;
  for (const item of items) total += item.w;
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.w;
    if (r <= 0) return item;
  }
  return items[0];
};

/* ------------------------------------------------------------------ */
/*  Shape painters (context is already translated + rotated)           */
/* ------------------------------------------------------------------ */

const DRAW = {
  // Notched cherry-blossom style petal with a soft gradient and centre vein.
  petal(c, p, tilt) {
    flip(c, tilt);
    const s = p.size;
    const base = tilt >= 0 ? p.color : mix(p.color, -0.16);
    const g = c.createLinearGradient(0, -s, 0, s);
    g.addColorStop(0, mix(p.color, 0.5));
    g.addColorStop(0.55, base);
    g.addColorStop(1, mix(p.color, -0.12));
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(0, s * 0.9);
    c.bezierCurveTo(s * 0.8, s * 0.35, s * 0.7, -s * 0.7, s * 0.14, -s * 0.95);
    c.lineTo(0, -s * 0.76);
    c.lineTo(-s * 0.14, -s * 0.95);
    c.bezierCurveTo(-s * 0.7, -s * 0.7, -s * 0.8, s * 0.35, 0, s * 0.9);
    c.fill();
    c.strokeStyle = mix(p.color, -0.25);
    c.globalAlpha *= 0.35;
    c.lineWidth = 0.6;
    c.beginPath();
    c.moveTo(0, s * 0.8);
    c.lineTo(0, -s * 0.5);
    c.stroke();
  },

  // Five-petal flower with a golden centre.
  blossom(c, p, tilt) {
    flip(c, tilt);
    const s = p.size;
    const col = tilt >= 0 ? p.color : mix(p.color, -0.14);
    for (let k = 0; k < 5; k++) {
      c.save();
      c.rotate((k * TAU) / 5);
      const g = c.createLinearGradient(0, 0, 0, -s);
      g.addColorStop(0, mix(p.color, -0.12));
      g.addColorStop(1, mix(p.color, 0.45));
      c.fillStyle = tilt >= 0 ? g : col;
      c.beginPath();
      c.ellipse(0, -s * 0.55, s * 0.32, s * 0.55, 0, 0, TAU);
      c.fill();
      c.restore();
    }
    c.fillStyle = "#f4b942";
    c.beginPath();
    c.arc(0, 0, s * 0.17, 0, TAU);
    c.fill();
  },

  // Simple leaf with a stem, midrib and side veins.
  leaf(c, p, tilt) {
    flip(c, tilt);
    const s = p.size * 1.5;
    const col = tilt >= 0 ? p.color : mix(p.color, -0.15);
    const g = c.createLinearGradient(-s * 0.6, 0, s * 0.6, 0);
    g.addColorStop(0, mix(col, 0.22));
    g.addColorStop(0.5, col);
    g.addColorStop(1, mix(col, -0.28));
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(0, -s);
    c.bezierCurveTo(s * 0.85, -s * 0.45, s * 0.75, s * 0.55, 0, s);
    c.bezierCurveTo(-s * 0.75, s * 0.55, -s * 0.85, -s * 0.45, 0, -s);
    c.fill();
    c.strokeStyle = mix(col, -0.4);
    c.lineWidth = 0.8;
    c.beginPath();
    c.moveTo(0, -s * 0.95);
    c.lineTo(0, s * 1.25);
    for (const i of [-0.4, 0, 0.4]) {
      c.moveTo(0, i * s);
      c.lineTo(s * 0.42, (i - 0.25) * s);
      c.moveTo(0, i * s);
      c.lineTo(-s * 0.42, (i - 0.25) * s);
    }
    c.stroke();
  },

  // Five-lobed maple leaf.
  maple(c, p, tilt) {
    flip(c, tilt);
    const s = p.size;
    const col = tilt >= 0 ? p.color : mix(p.color, -0.15);
    const g = c.createRadialGradient(0, -s * 0.2, s * 0.1, 0, 0, s);
    g.addColorStop(0, mix(col, 0.25));
    g.addColorStop(1, mix(col, -0.22));
    c.fillStyle = g;
    c.beginPath();
    for (let i = 0; i <= 80; i++) {
      const a = (i / 80) * TAU;
      const lobe = Math.pow(Math.max(0, Math.cos(a * 5)), 0.55);
      const r = s * (0.3 + 0.7 * lobe);
      const x = Math.sin(a) * r;
      const y = -Math.cos(a) * r;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.closePath();
    c.fill();
    c.strokeStyle = mix(col, -0.4);
    c.lineWidth = 0.7;
    c.beginPath();
    c.moveTo(0, s * 0.2);
    c.lineTo(0, s * 1.05);
    for (let k = 0; k < 5; k++) {
      const a = (k * TAU) / 5;
      c.moveTo(0, 0);
      c.lineTo(Math.sin(a) * s * 0.8, -Math.cos(a) * s * 0.8);
    }
    c.stroke();
  },

  // Six-armed, branching snowflake with a soft glow.
  flake(c, p, tilt) {
    c.scale(1, 0.55 + 0.45 * Math.abs(tilt));
    const s = p.size;
    c.shadowColor = p.lightMode ? "rgba(76,128,177,0.45)" : "rgba(190,220,255,0.9)";
    c.shadowBlur = p.lightMode ? 3 : 5;
    c.strokeStyle = p.lightMode ? "rgba(76,112,148,0.82)" : "rgba(255,255,255,0.95)";
    c.lineWidth = Math.max(0.8, s * 0.12);
    c.lineCap = "round";
    c.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = (k * TAU) / 6;
      const ca = Math.cos(a - Math.PI / 2);
      const sa = Math.sin(a - Math.PI / 2);
      c.moveTo(0, 0);
      c.lineTo(ca * s, sa * s);
      for (const t of [0.45, 0.72]) {
        const bx = ca * s * t;
        const by = sa * s * t;
        for (const side of [-1, 1]) {
          const ba = a - Math.PI / 2 + side * 0.9;
          c.moveTo(bx, by);
          c.lineTo(bx + Math.cos(ba) * s * 0.28, by + Math.sin(ba) * s * 0.28);
        }
      }
    }
    c.stroke();
    if (p.lightMode) {
      c.shadowBlur = 0;
      c.strokeStyle = "rgba(255,255,255,0.95)";
      c.lineWidth = Math.max(0.55, s * 0.065);
      c.stroke();
    }
  },

  // Soft round snow / dust.
  puff(c, p) {
    const s = p.size;
    const g = c.createRadialGradient(0, 0, 0, 0, 0, s);
    g.addColorStop(0, p.lightMode ? "rgba(113,153,190,0.78)" : "rgba(255,255,255,0.95)");
    g.addColorStop(0.5, p.lightMode ? "rgba(171,201,225,0.48)" : "rgba(220,238,255,0.42)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, s, 0, TAU);
    c.fill();
  },

  // Rain streak, rotated along its velocity.
  drop(c, p) {
    const len = p.size * 2.6;
    const g = c.createLinearGradient(0, -len, 0, 0);
    g.addColorStop(0, rgba(p.color, 0));
    g.addColorStop(1, rgba(p.color, 0.9));
    c.strokeStyle = g;
    c.lineWidth = lerp(0.8, 1.6, p.depth);
    c.lineCap = "round";
    if (p.lightMode) {
      c.shadowColor = "rgba(34,91,162,0.55)";
      c.shadowBlur = 3;
    }
    c.beginPath();
    c.moveTo(0, -len);
    c.lineTo(0, 0);
    c.stroke();
  },

  splash(c, p) {
    c.fillStyle = rgba(p.color, 1 - p.t / p.life);
    c.beginPath();
    c.arc(0, 0, p.size, 0, TAU);
    c.fill();
  },

  ripple(c, p) {
    const u = p.t / p.life;
    c.scale(1, 0.35);
    c.strokeStyle = rgba(p.color, (1 - u) * 0.5);
    c.lineWidth = 1;
    c.beginPath();
    c.arc(0, 0, p.size * (0.4 + u * 3.2), 0, TAU);
    c.stroke();
  },

  // Rectangular confetti that tumbles; the back side is darker.
  confetti(c, p, tilt) {
    flip(c, tilt);
    const w = p.size;
    const h = p.size * 0.55;
    c.fillStyle = mix(p.color, tilt * 0.25);
    c.fillRect(-w / 2, -h / 2, w, h);
  },

  // Wavy paper streamer.
  ribbon(c, p) {
    const L = p.size * 2.2;
    c.strokeStyle = p.color;
    c.lineWidth = 2.2;
    c.lineCap = "round";
    c.beginPath();
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      const x = (u - 0.5) * L;
      const y = Math.sin(u * TAU * 1.4 + p.phase * 2) * p.size * 0.35;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();
  },

  // Glass bubble with rim, refraction tint and a highlight; pops with a ring.
  bubble(c, p) {
    const s = p.size;
    if (p.popped) {
      const u = clamp(p.popT / 0.22, 0, 1);
      c.strokeStyle = `rgba(255,255,255,${0.7 * (1 - u)})`;
      c.lineWidth = 1.2;
      c.beginPath();
      c.arc(0, 0, s * (1 + u * 0.5), 0, TAU);
      c.stroke();
      for (let k = 0; k < 6; k++) {
        const a = (k * TAU) / 6 + p.ph2;
        c.fillStyle = `rgba(255,255,255,${0.8 * (1 - u)})`;
        c.beginPath();
        c.arc(Math.cos(a) * s * (1 + u * 0.9), Math.sin(a) * s * (1 + u * 0.9), 1.1, 0, TAU);
        c.fill();
      }
      return;
    }
    const g = c.createRadialGradient(-s * 0.3, -s * 0.3, s * 0.1, 0, 0, s);
    g.addColorStop(0, "rgba(255,255,255,0.05)");
    g.addColorStop(0.75, "rgba(180,220,255,0.12)");
    g.addColorStop(1, "rgba(180,220,255,0.38)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, s, 0, TAU);
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.55)";
    c.lineWidth = 1;
    c.stroke();
    c.fillStyle = "rgba(255,255,255,0.85)";
    c.beginPath();
    c.ellipse(-s * 0.38, -s * 0.4, s * 0.2, s * 0.11, -0.7, 0, TAU);
    c.fill();
  },

  // Glowing, flickering firefly.
  firefly(c, p) {
    const f = 0.5 + 0.5 * Math.sin(p.t * p.tw + p.ph2);
    const s = p.size;
    c.globalCompositeOperation = p.lightMode ? "source-over" : "lighter";
    const r = s * 6 * (0.7 + 0.3 * f);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, rgba(p.color, p.lightMode ? 0.72 * f + 0.12 : 0.85 * f + 0.1));
    g.addColorStop(0.35, rgba(p.color, p.lightMode ? 0.36 * f : 0.25 * f));
    g.addColorStop(1, rgba(p.color, 0));
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.fill();
    c.fillStyle = p.lightMode ? `rgba(111,128,28,${0.75 + 0.2 * f})` : `rgba(255,255,230,${0.6 + 0.4 * f})`;
    c.beginPath();
    c.arc(0, 0, s * (p.lightMode ? 0.62 : 0.5), 0, TAU);
    c.fill();
    if (p.lightMode) {
      c.fillStyle = `rgba(255,245,153,${0.8 * f})`;
      c.beginPath();
      c.arc(0, 0, s * 0.28, 0, TAU);
      c.fill();
    }
  },

  // Rising ember that cools from yellow to red.
  spark(c, p) {
    const heat = clamp(p.t / p.life, 0, 1);
    const hue = lerp(48, 8, heat);
    const s = p.size * (1 - 0.5 * heat);
    const flick = 0.7 + 0.3 * Math.sin(p.t * 18 + p.ph2);
    c.globalCompositeOperation = "lighter";
    const g = c.createRadialGradient(0, 0, 0, 0, 0, s * 4);
    g.addColorStop(0, `hsla(${hue},100%,65%,${0.95 * flick})`);
    g.addColorStop(0.4, `hsla(${hue},100%,50%,${0.3 * flick})`);
    g.addColorStop(1, `hsla(${hue},100%,50%,0)`);
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, s * 4, 0, TAU);
    c.fill();
  },

  // Four-point twinkle with halo (falling sparkles).
  sparkle(c, p) {
    const twinkle = 0.65 + 0.35 * Math.sin(p.t * 6 + p.ph2);
    const s = p.size * twinkle;
    c.globalCompositeOperation = "lighter";
    const g = c.createRadialGradient(0, 0, 0, 0, 0, s * 2.2);
    g.addColorStop(0, rgba(p.color, 0.6));
    g.addColorStop(1, rgba(p.color, 0));
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, s * 2.2, 0, TAU);
    c.fill();
    c.fillStyle = "#fff";
    c.beginPath();
    c.moveTo(0, -s);
    c.quadraticCurveTo(s * 0.12, -s * 0.12, s, 0);
    c.quadraticCurveTo(s * 0.12, s * 0.12, 0, s);
    c.quadraticCurveTo(-s * 0.12, s * 0.12, -s, 0);
    c.quadraticCurveTo(-s * 0.12, -s * 0.12, 0, -s);
    c.fill();
  },

  // Background star that twinkles.
  star(c, p) {
    const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(p.t * p.tw * 0.8 + p.ph2));
    const s = p.size;
    c.globalCompositeOperation = "lighter";
    const g = c.createRadialGradient(0, 0, 0, 0, 0, s * 4);
    g.addColorStop(0, rgba(p.color, 0.9 * twinkle));
    g.addColorStop(0.3, rgba(p.color, 0.25 * twinkle));
    g.addColorStop(1, rgba(p.color, 0));
    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, s * 4, 0, TAU);
    c.fill();
    c.fillStyle = `rgba(255,255,255,${twinkle})`;
    c.beginPath();
    c.arc(0, 0, s * 0.5, 0, TAU);
    c.fill();
  },

  // Shooting star with a tapering trail.
  meteor(c, p) {
    const L = p.size;
    c.rotate(Math.atan2(p.vy, p.vx));
    c.globalCompositeOperation = "lighter";
    const g = c.createLinearGradient(-L, 0, 0, 0);
    g.addColorStop(0, "rgba(160,190,255,0)");
    g.addColorStop(1, "rgba(255,255,255,0.95)");
    c.strokeStyle = g;
    c.lineWidth = 2;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(-L, 0);
    c.lineTo(0, 0);
    c.stroke();
    const h = c.createRadialGradient(0, 0, 0, 0, 0, 10);
    h.addColorStop(0, "rgba(255,255,255,0.95)");
    h.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = h;
    c.beginPath();
    c.arc(0, 0, 10, 0, TAU);
    c.fill();
  },

  // Glossy heart.
  heart(c, p, tilt) {
    c.scale(1, 0.75 + 0.25 * Math.abs(tilt));
    const s = p.size;
    const g = c.createRadialGradient(-s * 0.3, -s * 0.4, s * 0.1, 0, 0, s * 1.2);
    g.addColorStop(0, mix(p.color, 0.4));
    g.addColorStop(1, mix(p.color, -0.18));
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(0, s * 0.8);
    c.bezierCurveTo(-s * 1.3, -s * 0.1, -s * 0.7, -s * 1.1, 0, -s * 0.4);
    c.bezierCurveTo(s * 0.7, -s * 1.1, s * 1.3, -s * 0.1, 0, s * 0.8);
    c.fill();
    c.fillStyle = "rgba(255,255,255,0.35)";
    c.beginPath();
    c.ellipse(-s * 0.42, -s * 0.5, s * 0.22, s * 0.12, -0.6, 0, TAU);
    c.fill();
  },

  // Music notes drawn as text glyphs (not emoji) with a colour glow.
  note(c, p) {
    c.font = `700 ${p.size * 2}px "Segoe UI Symbol","Apple Symbols","Noto Sans Symbols",serif`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.shadowColor = p.color;
    c.shadowBlur = 8;
    c.fillStyle = p.color;
    c.fillText(p.glyph, 0, 0);
  },

  // Neon code token.
  glyph(c, p) {
    c.font = `800 ${p.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.shadowColor = p.color;
    c.shadowBlur = 9;
    c.fillStyle = p.color;
    c.fillText(p.glyph, 0, 0);
  },
};

const SHADOWED = new Set(["petal", "blossom", "leaf", "maple", "confetti", "heart"]);

/* ------------------------------------------------------------------ */
/*  Simulation                                                         */
/* ------------------------------------------------------------------ */

const DEFAULTS = { freq: [2, 3], flutter: 0.6, sway: 100, bounce: 0, term: [60, 110], g: 60 };

const spawnParticle = (rawItem, env) => {
  const item = { ...DEFAULTS, ...rawItem };
  const { W, H, origin, reduced } = env;
  const depth = Math.random();
  const size = lerp(item.size[0], item.size[1], depth);
  const motion = reduced ? "static" : item.motion;
  const p = {
    kind: item.kind,
    motion,
    color: item.colors ? pick(item.colors) : "#ffffff",
    lightMode: env.lightMode,
    glyph: item.glyphs ? pick(item.glyphs) : "",
    size,
    depth,
    alpha: lerp(0.62, 1, depth) * (item.alpha ?? 1),
    x: 0, y: 0, vx: 0, vy: 0,
    rot: 0,
    rot0: item.upright ? 0 : rand(0, TAU),
    spin: 0,
    vr: item.upright ? 0 : rand(-1, 1) * (item.spin ?? 1),
    phase: rand(0, TAU),
    freq: rand(item.freq[0], item.freq[1]),
    ph2: rand(0, TAU),
    ang: rand(0, TAU),
    tw: rand(2, 5),
    term: rand(item.term[0], item.term[1]) * (0.85 + 0.3 * depth),
    flutter: item.flutter,
    sway: item.sway,
    windK: item.windK ?? 0.6 + 0.6 * depth,
    dragK: 2.2,
    bounce: item.bounce,
    bounces: 0,
    g: item.g,
    life: item.life ? rand(item.life[0], item.life[1]) : Infinity,
    popAt: item.pop ? rand(item.pop[0], item.pop[1]) : 0,
    popped: false,
    popT: 0,
    delay: 0,
    started: false,
    t: 0,
    tilt: 1,
    flat: 1,
    landed: false,
    landT: 0,
    restT: rand(1.2, 2.6),
    restY: size * 0.3 + rand(0, 16),
    dead: false,
  };

  if (reduced) {
    p.x = rand(0, W);
    p.y = rand(90, H * 0.75);
    p.tilt = 0.85;
    p.started = true;
    return p;
  }

  switch (motion) {
    case "fall": {
      p.x = rand(0, W);
      const top = item.top ?? [50, 96];
      p.y = rand(top[0], top[1]);
      p.delay = item.delay ? rand(item.delay[0], item.delay[1]) : (env.sweepLeft ? p.x / W : 1 - p.x / W) * 0.9 + rand(0, 0.45);
      p.vy = p.term * (item.v0 ?? 0.25);
      p.vx = env.windAt(0) * 0.3 + rand(-20, 20);
      break;
    }
    case "rise": {
      p.x = rand(0, W);
      p.y = H + size + rand(0, 40);
      p.delay = rand(item.delay?.[0] ?? 0, item.delay?.[1] ?? 2.6);
      p.vy = -p.term * 0.6;
      break;
    }
    case "float": {
      p.x = rand(W * 0.04, W * 0.96);
      p.y = rand(H * 0.12, H * 0.92);
      p.delay = rand(item.delay?.[0] ?? 0, item.delay?.[1] ?? 3.5);
      break;
    }
    case "burst": {
      p.x = origin.x + rand(-18, 18);
      p.y = origin.y + rand(-10, 10);
      const a = -Math.PI / 2 + rand(-0.95, 0.95);
      const speed = rand(150, 340);
      p.vx = Math.cos(a) * speed;
      p.vy = Math.sin(a) * speed;
      p.delay = rand(item.delay?.[0] ?? 0, item.delay?.[1] ?? 0.9);
      break;
    }
    case "shoot": {
      p.x = rand(W * 0.4, W);
      p.y = rand(40, Math.max(H * 0.35, 80));
      const a = rand(2.4, 2.7);
      const speed = rand(700, 1000);
      p.vx = Math.cos(a) * speed;
      p.vy = Math.sin(a) * speed;
      p.life = rand(0.7, 1.1);
      p.delay = rand(item.delay?.[0] ?? 0.3, item.delay?.[1] ?? 5);
      break;
    }
    default:
      break;
  }
  return p;
};

const mini = (kind, x, y, vx, vy, life, size, color) => ({
  kind, motion: kind === "ripple" ? "ripple" : "ballistic", color, size, depth: 0.5, alpha: 1,
  x, y, vx, vy, rot: 0, life, t: 0, tilt: 1, started: true, dead: false,
});

const step = (p, dt, T, env, out) => {
  const { W, H } = env;
  p.t += dt;
  p.phase += p.freq * dt;
  const wind = env.windAt(T) * p.windK;
  const k = (rate) => Math.min(1, dt * rate);

  switch (p.motion) {
    case "fall": {
      if (!p.landed) {
        const cosP = Math.cos(p.phase);
        p.tilt = cosP;
        // Face-on to the fall = more drag; edge-on = slips through the air faster.
        const target = p.term * (1 - 0.38 * p.flutter * Math.abs(cosP));
        p.vy += (target - p.vy) * k(p.dragK);
        p.vx += (wind - p.vx) * k(1.4) + cosP * p.sway * p.flutter * dt;
        p.spin += p.vr * dt;
        p.rot = p.rot0 + p.spin + Math.sin(p.phase * 0.5 + p.ph2) * 0.6 * p.flutter + p.vx * 0.003;
        if (p.kind === "drop") p.rot = Math.atan2(-p.vx, p.vy);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        else if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }

        const floor = H - p.restY;
        if (p.y >= floor) {
          p.y = floor;
          if (p.kind === "drop") {
            const n = 3 + Math.floor(Math.random() * 3);
            for (let i = 0; i < n; i++) out.push(mini("splash", p.x, floor, rand(-90, 90), -rand(90, 220), rand(0.3, 0.55), rand(0.7, 1.4), p.color));
            out.push(mini("ripple", p.x, floor, 0, 0, 0.5, rand(3, 6), p.color));
            p.dead = true;
          } else if (p.bounce > 0 && p.bounces < 2 && p.vy > 60) {
            p.vy = -p.vy * p.bounce;
            p.vx *= 0.6;
            p.vr *= 0.5;
            p.bounce *= 0.6;
            p.bounces++;
          } else {
            p.landed = true;
            p.vy = 0;
            p.flat = cosP < 0 ? -1 : 1;
          }
        }
      } else {
        p.landT += dt;
        p.vx *= Math.max(0, 1 - dt * 5);
        p.x += p.vx * dt;
        p.tilt = lerp(p.tilt, p.flat * 0.4, k(8));
        if (p.landT > p.restT + 0.9) p.dead = true;
      }
      break;
    }
    case "rise": {
      if (p.popped) {
        p.popT += dt;
        if (p.popT > 0.22) p.dead = true;
        break;
      }
      p.vy += (-p.term - p.vy) * k(1.2);
      p.vx += (wind * 0.3 - p.vx) * k(1.5) + Math.cos(p.phase) * p.sway * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot = Math.sin(p.phase * 0.5 + p.ph2) * 0.25 * p.flutter;
      if (p.popAt && p.t > p.popAt) p.popped = true;
      if (p.y < -70 || p.t > p.life) p.dead = true;
      break;
    }
    case "float": {
      const ang = p.ang + Math.sin(p.phase) * 1.1 + Math.sin(p.phase * 0.37 + p.ph2) * 1.7;
      p.vx = Math.cos(ang) * p.term + wind * 0.1;
      p.vy = Math.sin(ang) * p.term * 0.7;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.t > p.life) p.dead = true;
      break;
    }
    case "burst": {
      p.vx += Math.cos(p.phase) * p.sway * dt;
      p.vx *= 1 - k(0.9);
      p.vy = p.vy * (1 - k(0.9)) + p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot = Math.sin(p.phase * 0.7 + p.ph2) * 0.35 * p.flutter;
      if (p.t > p.life) p.dead = true;
      break;
    }
    case "shoot": {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.t > p.life) p.dead = true;
      break;
    }
    case "ballistic": {
      p.vy += 1100 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.t > p.life) p.dead = true;
      break;
    }
    case "ripple": {
      if (p.t > p.life) p.dead = true;
      break;
    }
    default:
      break;
  }
};

const alphaOf = (p, T) => {
  if (p.motion === "static") return p.alpha * Math.sin(Math.PI * clamp(T / 1.8, 0, 1));
  if (p.motion === "ballistic" || p.motion === "ripple") return 1;
  let a = p.alpha * Math.min(1, p.t / (p.motion === "float" ? 1 : 0.3));
  if (Number.isFinite(p.life)) a *= 1 - smooth((p.t - (p.life - 0.9)) / 0.9);
  if (p.landed) a *= 1 - clamp((p.landT - p.restT) / 0.9, 0, 1);
  return a;
};

const startShower = (canvas, themeKey, origin, onDone) => {
  const theme = THEMES[themeKey];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const c = canvas.getContext("2d");
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  // One shared wind with gusts so the whole shower leans the same way.
  const windBase = rand(-1, 1) * theme.wind;
  const gust = theme.wind * 0.5;
  const g1 = rand(0, TAU);
  const g2 = rand(0, TAU);
  const env = {
    W, H, origin, reduced,
    lightMode: !document.documentElement.classList.contains("dark"),
    sweepLeft: Math.random() < 0.5,
    windAt: (T) => windBase + Math.sin(T * 0.9 + g1) * gust + Math.sin(T * 2.4 + g2) * gust * 0.35,
  };

  const count = reduced ? 20 : Math.round(theme.count * (W < 640 ? 0.55 : 1));
  let parts = Array.from({ length: count }, () => spawnParticle(weighted(theme.items), env));
  parts.sort((a, b) => a.depth - b.depth);

  let raf = 0;
  let stopped = false;
  let last = performance.now();
  let T = 0;

  const finish = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", finish);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    onDone?.();
  };

  const render = () => {
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    for (const p of parts) {
      if (!p.started || p.dead) continue;
      const a = alphaOf(p, T);
      if (a <= 0.01) continue;
      c.save();
      if (SHADOWED.has(p.kind) && p.depth > 0.5) {
        c.shadowColor = "rgba(0,0,0,0.22)";
        c.shadowBlur = 4;
        c.shadowOffsetY = 2;
      }
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.globalAlpha = a;
      DRAW[p.kind](c, p, p.tilt);
      c.restore();
    }
  };

  const frame = (now) => {
    if (stopped) return;
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    T += dt;
    const spawned = [];
    if (!reduced) {
      for (const p of parts) {
        if (p.dead) continue;
        if (!p.started) {
          if (T < p.delay) continue;
          p.started = true;
        }
        step(p, dt, T, env, spawned);
      }
      if (spawned.length) parts.push(...spawned);
      parts = parts.filter((p) => !p.dead);
    }
    render();
    if (T > 18 || (reduced && T > 1.8) || (!reduced && parts.length === 0)) {
      finish();
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  window.addEventListener("resize", finish);
  raf = requestAnimationFrame(frame);

  // Cleanup used on unmount: stop without notifying.
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", finish);
  };
};

export const ParticleShower = ({ theme, origin, onDone }) => {
  const canvasRef = useRef(null);
  useEffect(() => startShower(canvasRef.current, theme, origin, onDone), []); // eslint-disable-line react-hooks/exhaustive-deps
  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 9999, pointerEvents: "none" }}
    />,
    document.body,
  );
};

