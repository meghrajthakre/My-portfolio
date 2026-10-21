// Flower and particle effect theme configuration.
const ACTIVE_THEME = "random";

/*
  Every particle is drawn with canvas paths/gradients (no emoji), so it looks identical on every device,
  and is moved by a small physics simulation (gravity + drag + wind gusts + flutter + bounce).

  item fields
    kind    : which shape to draw
    w       : spawn weight
    motion  : "fall" (curtain from the navbar) | "rise" (from the bottom) | "float" (wanders, fades in/out)
              | "burst" (shoots out of the avatar) | "shoot" (meteor)
    colors  : palette            size : [min,max] px (near particles are bigger)
    term    : [min,max] terminal velocity px/s      freq : flutter frequency rad/s
    flutter : 0..1 how much it tumbles/sways        sway : sideways flutter force
    bounce  : floor restitution                     delay: [min,max] spawn spread in seconds (default: wave across screen)
    top     : [min,max] spawn y for "fall"          life : [min,max] seconds (finite lifetime)
*/
const THEMES = {
  garden: {
    count: 74,
    wind: 70,
    items: [
      { kind: "petal", w: 6, motion: "fall", colors: ["#ffc2d1", "#ffb3c6", "#ff8fab", "#fde2e4", "#ffd6e0"], size: [5, 9], term: [85, 135], freq: [2, 3.2], flutter: 1, sway: 260 },
      { kind: "blossom", w: 2, motion: "fall", colors: ["#ffb7c5", "#fff1f2", "#ffe66d", "#e0aaff"], size: [7, 12], term: [95, 145], freq: [1.8, 2.8], flutter: 0.8, sway: 220 },
      { kind: "leaf", w: 1, motion: "fall", colors: ["#7bb661", "#98c379", "#6a994e"], size: [5, 8], term: [110, 160], freq: [1.8, 2.8], flutter: 0.9, sway: 240 },
    ],
  },
  autumn: {
    count: 66,
    wind: 95,
    items: [
      { kind: "maple", w: 4, motion: "fall", colors: ["#d9480f", "#e8590c", "#f08c00", "#c92a2a", "#e67700"], size: [8, 14], term: [115, 175], freq: [1.7, 2.6], flutter: 0.9, sway: 300, bounce: 0 },
      { kind: "leaf", w: 4, motion: "fall", colors: ["#a05a2c", "#c47f2a", "#e8a33d", "#8a5a1f", "#b5651d"], size: [7, 12], term: [115, 175], freq: [1.7, 2.6], flutter: 0.9, sway: 300 },
    ],
  },
  winter: {
    count: 120,
    wind: 55,
    items: [
      { kind: "flake", w: 3, motion: "fall", colors: ["#ffffff"], size: [5, 10], term: [55, 95], freq: [1.2, 2.2], flutter: 0.5, sway: 110, spin: 0.8, delay: [0, 3.2] },
      { kind: "puff", w: 5, motion: "fall", colors: ["#ffffff"], size: [1.6, 3.6], term: [45, 90], freq: [1.2, 2.2], flutter: 0.4, sway: 90, delay: [0, 3.2] },
    ],
  },
  rain: {
    count: 170,
    wind: 140,
    items: [
      { kind: "drop", w: 1, motion: "fall", colors: ["#a9c7ff"], size: [5, 9], term: [1000, 1500], v0: 0.8, flutter: 0, sway: 0, windK: 0.45, upright: true, top: [-90, -10], delay: [0, 4.4] },
    ],
  },
  confetti: {
    count: 96,
    wind: 35,
    items: [
      { kind: "confetti", w: 6, motion: "fall", colors: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff9f1c", "#2ec4b6"], size: [6, 11], term: [150, 235], freq: [5, 9], flutter: 1, sway: 420, spin: 5, bounce: 0.28 },
      { kind: "ribbon", w: 1.4, motion: "fall", colors: ["#ff595e", "#ffca3a", "#1982c4", "#c77dff"], size: [6, 10], term: [130, 200], freq: [3, 5], flutter: 0.8, sway: 300, spin: 2, bounce: 0.15 },
    ],
  },
  festive: {
    count: 78,
    wind: 50,
    items: [
      { kind: "petal", w: 4, motion: "fall", colors: ["#ff9f1c", "#ffb703", "#fb8500", "#ffd166"], size: [5, 9], term: [90, 140], freq: [2, 3], flutter: 1, sway: 240 },
      { kind: "blossom", w: 2, motion: "fall", colors: ["#ff9f1c", "#ffb703", "#f77f00"], size: [8, 13], term: [100, 150], freq: [1.8, 2.6], flutter: 0.8, sway: 220 },
      { kind: "spark", w: 5, motion: "rise", colors: ["#ffd166"], size: [1.8, 3.6], term: [90, 200], flutter: 1, sway: 90, life: [2.2, 4.2], delay: [0, 3] },
      { kind: "sparkle", w: 2, motion: "float", colors: ["#fff3b0", "#ffd166", "#ff9f1c"], size: [4, 9], term: [4, 12], life: [2.5, 4.5], delay: [0, 3.5] },
    ],
  },
  cosmic: {
    count: 64,
    wind: 10,
    items: [
      { kind: "star", w: 5, motion: "float", colors: ["#ffffff", "#fff3b0", "#cdb4ff", "#a5d8ff"], size: [1.6, 4.2], term: [2, 8], life: [3.5, 6.5], delay: [0, 4] },
      { kind: "sparkle", w: 3, motion: "fall", colors: ["#fff3b0", "#ffd166", "#e0c3ff"], size: [4, 8], term: [40, 80], freq: [1.5, 2.5], flutter: 0.3, sway: 40, delay: [0, 3.5] },
      { kind: "meteor", w: 0.55, motion: "shoot", colors: ["#ffffff"], size: [110, 200], delay: [0.3, 5.5] },
    ],
  },
  fireflies: {
    count: 38,
    wind: 10,
    items: [
      { kind: "firefly", w: 1, motion: "float", colors: ["#e9ff70", "#c8ff5c", "#ffe66d"], size: [2.2, 4.2], term: [14, 34], life: [5, 9], delay: [0, 3.5] },
    ],
  },
  bubbles: {
    count: 48,
    wind: 25,
    items: [
      { kind: "bubble", w: 1, motion: "rise", colors: ["#bfe3ff"], size: [6, 22], term: [70, 130], flutter: 1, sway: 55, pop: [2.5, 8], delay: [0, 3] },
    ],
  },
  love: {
    count: 54,
    wind: 30,
    items: [
      { kind: "heart", w: 3, motion: "burst", colors: ["#ff4d6d", "#ff758f", "#ff8fa3", "#e5383b"], size: [8, 17], term: [0, 0], flutter: 0.4, sway: 60, g: 55, life: [3, 5], delay: [0, 0.9], upright: true },
      { kind: "heart", w: 3, motion: "fall", colors: ["#ff4d6d", "#ff758f", "#ffb3c1"], size: [5, 10], term: [80, 120], freq: [1.8, 2.6], flutter: 0.4, sway: 130, upright: true },
      { kind: "petal", w: 3, motion: "fall", colors: ["#c9184a", "#e5383b", "#a4133c"], size: [5, 9], term: [90, 140], freq: [2, 3], flutter: 1, sway: 250 },
    ],
  },
  music: {
    count: 46,
    wind: 25,
    items: [
      { kind: "note", w: 1, motion: "rise", glyphs: ["♪", "♫", "♬", "♩"], colors: ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#c77dff"], size: [9, 18], term: [60, 120], flutter: 1, sway: 90, life: [4, 7], delay: [0, 3.2], upright: true },
    ],
  },
  code: {
    count: 74,
    wind: 0,
    items: [
      { kind: "glyph", w: 1, motion: "fall", glyphs: ["</>", "{}", "01", "=>", "[]", ";", "fn", "<div>", "#!", "404", "&&", "++", "0x"], colors: ["#7cf7c7", "#71d9ff", "#b69cff", "#f5e27a", "#ff93bd"], size: [9, 15], term: [140, 260], flutter: 0, sway: 0, upright: true, windK: 0 },
    ],
  },
};

const pickTheme = (list) => list[Math.floor(Math.random() * list.length)];
let lastTheme = null;

export const chooseTheme = () => {
  if (THEMES[ACTIVE_THEME]) return ACTIVE_THEME;
  const keys = Object.keys(THEMES).filter((key) => key !== lastTheme);
  lastTheme = pickTheme(keys);
  return lastTheme;
};

export { THEMES };