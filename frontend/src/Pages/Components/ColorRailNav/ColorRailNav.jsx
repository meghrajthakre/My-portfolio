import { useEffect, useState } from "react";

/*
 * Images: koi internet/URL nahi chahiye. Neeche ke "architecture" graphics
 * code se hi bante hain (SVG), isliye hamesha dikhenge.
 * Apni photo lagani ho to link me `image: "https://..."` (ya import ki hui image) de do,
 * wo in graphics ki jagah use hogi.
 */
const svg = (body) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice">${body}</svg>`);

const range = (n) => Array.from({ length: n }, (_, i) => i);

// 1) balcony wali facade
const facade = svg(
  `<rect width="600" height="600" fill="#dcd6ca"/>` +
    range(6)
      .map((r) =>
        range(5)
          .map(
            (c) =>
              `<rect x="${40 + c * 105}" y="${40 + r * 92}" width="80" height="62" fill="${
                (r + c) % 3 === 0 ? "#2a2a2e" : "#8d8a84"
              }"/><rect x="${34 + c * 105}" y="${106 + r * 92}" width="92" height="6" fill="#55524c"/>`
          )
          .join("")
      )
      .join("")
);

// 2) diagonal slab
const slab = svg(
  `<rect width="600" height="600" fill="#f4f0e8"/>
   <polygon points="0,430 600,110 600,190 0,510" fill="#38383d"/>
   <polygon points="0,510 600,190 600,222 0,546" fill="#9d9a94"/>
   ${range(10)
     .map((i) => `<rect x="${i * 62}" y="${470 - i * 32}" width="6" height="${130 + i * 30}" fill="#c0bcb3"/>`)
     .join("")}`
);

// 3) interior / hall
const hall = svg(
  `<rect width="600" height="600" fill="#f5f2ec"/>
   <polygon points="0,380 600,380 600,600 0,600" fill="#dfdbd2"/>
   ${range(5).map((i) => `<rect x="${60 + i * 120}" y="90" width="16" height="290" fill="#bcb7ac"/>`).join("")}
   ${range(8).map((i) => `<rect x="0" y="${60 + i * 6}" width="600" height="2" fill="#e6e2d9"/>`).join("")}
   <circle cx="210" cy="470" r="12" fill="#2d2d31"/><rect x="200" y="482" width="20" height="46" rx="8" fill="#2d2d31"/>
   <circle cx="400" cy="500" r="12" fill="#2d2d31"/><rect x="390" y="512" width="20" height="46" rx="8" fill="#2d2d31"/>`
);

// 4) fluted wall + figure
const fluted = svg(
  `<rect width="600" height="600" fill="#ddd8cd"/>
   ${range(30).map((i) => `<rect x="${i * 20}" y="0" width="11" height="600" fill="#b6b0a3"/>`).join("")}
   <rect x="330" y="80" width="150" height="440" fill="#f1ede4"/>
   <rect x="440" y="230" width="10" height="90" fill="#1c1c20"/>
   <rect x="370" y="170" width="64" height="300" rx="30" fill="#1c1c20" opacity=".85"/>`
);

// 5) blocks / skyline
const heights = [200, 320, 260, 430, 300, 380, 240, 340];
const blocks = svg(
  `<rect width="600" height="600" fill="#e9e5dc"/>` +
    heights
      .map(
        (h, i) =>
          `<rect x="${i * 75}" y="${600 - h}" width="66" height="${h}" fill="${i % 2 ? "#47474c" : "#7f7c76"}"/>` +
          range(Math.floor(h / 40))
            .map((r) => `<rect x="${i * 75 + 10}" y="${600 - h + 14 + r * 40}" width="46" height="14" fill="#e0dcd2"/>`)
            .join("")
      )
      .join("")
);

// 6) stepped tower
const tower = svg(
  `<rect width="600" height="600" fill="#eeeae1"/>` +
    [400, 320, 240, 160]
      .map((w, i) => {
        const y = 600 - (i + 1) * 130;
        return (
          `<rect x="${300 - w / 2}" y="${y}" width="${w}" height="130" fill="${["#46464b", "#6b6a68", "#8e8c87", "#afada7"][i]}"/>` +
          range(Math.floor(w / 40))
            .map((c) => `<rect x="${300 - w / 2 + 14 + c * 40}" y="${y + 20}" width="22" height="90" fill="#e4e0d6"/>`)
            .join("")
        );
      })
      .join("")
);

/*
 * Default columns use the site's active theme palette. Custom links can still
 * provide their own `bg` and `fg` values.
 */
const DEFAULT_LINKS = [
  { label: "Home", bg: "#ff4d2e", fg: "#ffffff", image: facade },
  { label: "Projects", bg: "#ffc933", fg: "#111111", image: slab },
  { label: "About us", bg: "#1e5bff", fg: "#ffffff", image: hall },
  { label: "News and insights", bg: "#17c37b", fg: "#06281a", image: fluted },
  { label: "Vacancies", bg: "#8b5cf6", fg: "#ffffff", image: blocks },
  { label: "Contact", bg: "#ff7ab8", fg: "#111111", image: tower },
];

/* Hamburger / X icon colors */
const ICON_COLOR_CLOSED = "var(--color-accent)";
const ICON_COLOR_OPEN = "var(--color-text)";

/*
 * SIZE: navbar ko bada/chhota karna ho to niche ke --bar-w, --bar-h, --rail-h,
 * --fs (button text), --col-h (column height) badlo.
 * Har size `max(<% of width>, <minimum px>)` hai, to chhote preview me bhi
 * navbar kabhi minimum se chhota nahi hoga.
 */
const CSS = `
.crn-root{container:crn/inline-size;width:100%}
.crn-stage{
  --bar-w:max(24cqw,300px);
  --bar-h:max(3.6cqw,52px);
  --rail-h:max(1.6cqw,24px);
  --bar-gap:max(1.6cqw,24px);
  --fs:max(1.05cqw,17px);
  --icon-w:max(1.5cqw,26px);
  --icon-t:max(.14cqw,3px);
  --pad:max(1.6cqw,24px);
  --col-h:max(24.3229cqw,340px);
  --title-fs:max(1.4cqw,18px);
  --title-pad:max(1cqw,16px);
  --dot:max(.7cqw,10px);

  --ink:var(--color-text);--bone:var(--color-card-bg);--accent:var(--color-accent);--muted:var(--color-secondary-text);
  --tbg:var(--ink);--tfg:var(--bone);--icon:${ICON_COLOR_CLOSED};

  position:relative;width:100%;min-height:max(56.25cqw,400px);overflow:hidden;isolation:isolate;
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;
  background:transparent}
.crn-stage[data-state="open"]{--tbg:var(--bone);--tfg:var(--ink);--icon:${ICON_COLOR_OPEN}}

/* ---------- dim backdrop (click = close) ---------- */
.crn-backdrop{position:absolute;inset:0;z-index:1;background:var(--ink);opacity:0;
  pointer-events:none;transition:opacity .98s linear}
.crn-stage[data-state="open"] .crn-backdrop{opacity:.55;pointer-events:auto;cursor:pointer;
  transition:opacity .48s linear .38s}

/* ---------- rail / columns container ---------- */
.crn-nav{position:absolute;left:50%;bottom:0;z-index:2;transform:translateX(-50%);
  display:flex;flex-direction:row;justify-content:center;align-items:flex-end;
  width:0;height:var(--rail-h);transition:width .98s cubic-bezier(.48,0,.03,1)}
.crn-stage[data-state="visible"] .crn-nav{width:var(--bar-w)}
.crn-stage[data-state="open"] .crn-nav{width:100cqw}

/* ---------- ek column / strip ---------- */
.crn-item{display:block;position:relative;flex:0 0 auto;bottom:0;width:0;height:var(--rail-h);
  color:var(--fg);background:var(--bg);text-decoration:none;transform-origin:50%;
  box-shadow:inset -1px 0 0 #0f111512;outline:none;
  transition:all .98s cubic-bezier(.65,0,0,1);
  transition-delay:calc((var(--i) + 1) * 50ms)}
.crn-stage[data-state="visible"] .crn-item{width:16.6667%;height:var(--rail-h);cursor:pointer}
.crn-stage[data-state="visible"] .crn-item:hover{height:calc(var(--rail-h) * 1.7);
  transition-duration:.35s;transition-delay:0s}
.crn-stage[data-state="open"] .crn-item{width:16.6667%;height:var(--col-h)}
.crn-item:focus-visible{box-shadow:inset 0 0 0 3px var(--accent)}

.crn-inner{position:relative;width:100%;height:0;overflow:hidden;transform-origin:top;
  transition:height .88s cubic-bezier(.65,0,0,1) 50ms,opacity .4s cubic-bezier(.65,0,0,1) 50ms}
.crn-stage[data-state="initial"] .crn-inner,
.crn-stage[data-state="visible"] .crn-inner{opacity:0}
.crn-stage[data-state="open"] .crn-inner{height:calc(var(--col-h) * .9315);transition-delay:.1s}
/* hover pe baaki columns halke dim */
.crn-stage[data-state="open"] .crn-nav:hover .crn-item:not(:hover) .crn-inner{opacity:.55;transition-delay:0s}

.crn-title{position:absolute;top:var(--title-pad);left:var(--title-pad);display:flex;align-items:center;
  gap:calc(var(--dot) * .7);font-size:var(--title-fs);font-weight:600;line-height:132%;white-space:nowrap;
  letter-spacing:-.01em;transform:translateY(14px);opacity:0;
  transition:transform .8s cubic-bezier(.2,.8,.2,1),opacity .6s ease}
.crn-stage[data-state="open"] .crn-title{transform:none;opacity:1;transition-delay:calc(.45s + var(--i) * 70ms)}
.crn-dot{flex-shrink:0;display:inline-block;width:var(--dot);height:var(--dot);border-radius:50%;
  background:currentColor;animation:crn-dot 2.2s ease-out infinite}

/* ---------- image (grayscale + column color tint, hover pe asli color) ---------- */
.crn-img{position:absolute;left:17.5%;width:65%;aspect-ratio:1/1;overflow:hidden;
  top:max(6.77083cqw,calc(var(--title-pad) * 2 + var(--title-fs) * 1.6));
  clip-path:inset(100% 0 0 0);
  transition:transform .92s cubic-bezier(.5,0,0,1),clip-path .35s ease}
.crn-stage[data-state="open"] .crn-img{clip-path:inset(0 0 0 0);
  transition:transform .92s cubic-bezier(.5,0,0,1),clip-path 1s cubic-bezier(.65,0,0,1) calc(.4s + var(--i) * 70ms)}
.crn-img::after{content:"";position:absolute;inset:0;background:var(--bg);mix-blend-mode:overlay;
  transition:opacity .92s cubic-bezier(.5,0,0,1)}
.crn-img img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;
  filter:grayscale(1);transform:scale(1.3);
  transition:transform 1.2s cubic-bezier(.5,0,0,1),filter .92s cubic-bezier(.5,0,0,1)}
.crn-stage[data-state="open"] .crn-img img{transform:scale(1);transition-delay:calc(.4s + var(--i) * 70ms),0s}
.crn-stage[data-state="open"] .crn-item:hover .crn-img{transform:translateY(-6px) scale(1.03)}
.crn-stage[data-state="open"] .crn-item:hover .crn-img::after{opacity:0}
.crn-stage[data-state="open"] .crn-item:hover .crn-img img{filter:grayscale(0);transform:scale(1.1);
  transition-delay:0s}

/* arrow jo hover pe slide hota hai */
.crn-arrow{position:absolute;left:var(--title-pad);bottom:calc(var(--title-pad) * .9);display:flex;align-items:center;
  justify-content:center;width:calc(var(--title-fs) * 1.5);height:calc(var(--title-fs) * 1.5);border-radius:50%;
  border:1.5px solid currentColor;font-size:calc(var(--title-fs) * .8);line-height:1;
  opacity:0;transform:translateX(-10px);transition:opacity .4s ease,transform .5s cubic-bezier(.2,.8,.2,1),
    background-color .3s,color .3s}
.crn-stage[data-state="open"] .crn-item:hover .crn-arrow{opacity:1;transform:none}
.crn-item:hover .crn-arrow{background:var(--fg);color:var(--bg)}

/* ---------- Open / Close button ---------- */
.crn-toggle{position:absolute;left:50%;bottom:var(--bar-gap);z-index:3;transform:translateX(-50%);
  display:flex;align-items:center;width:0;height:0;padding:0;border:0;overflow:hidden;border-radius:2px;
  cursor:pointer;font:inherit;background:var(--tbg);color:var(--tfg);
  box-shadow:0 14px 40px -12px #0f111580;
  transition:background-color .88s linear,color .88s linear,
    height .98s cubic-bezier(.65,0,0,1) .45s,width .98s cubic-bezier(.65,0,0,1) .23s,
    opacity .48s cubic-bezier(.48,0,.03,1)}
.crn-toggle::before{content:"";position:absolute;top:0;bottom:0;left:-40%;width:35%;pointer-events:none;
  background:linear-gradient(100deg,transparent,#ffffff40,transparent);transform:skewX(-20deg);opacity:0}
.crn-stage[data-state="visible"] .crn-toggle::before{opacity:1;animation:crn-shimmer 3.6s ease-in-out 1.8s infinite}
.crn-stage[data-state="visible"] .crn-toggle,
.crn-stage[data-state="open"] .crn-toggle{width:var(--bar-w);height:var(--bar-h)}
.crn-toggle:focus-visible{outline:3px solid var(--accent);outline-offset:3px}

.crn-toggle-text{position:relative;padding-left:var(--pad);font-size:var(--fs);font-weight:600;
  line-height:130%;letter-spacing:.02em;color:inherit;opacity:0;transform:translate(calc(var(--pad) * .8));
  transition:color .88s linear,transform .75s cubic-bezier(.65,0,0,1) .82s,
    opacity .75s cubic-bezier(.65,0,0,1) .82s,padding-left .22s cubic-bezier(.5,0,0,1)}
.crn-stage[data-state="visible"] .crn-toggle-text,
.crn-stage[data-state="open"] .crn-toggle-text{opacity:1;transform:translate(0)}
@media (hover:hover){.crn-toggle:hover .crn-toggle-text{padding-left:calc(var(--pad) * 1.25)}}

/* hamburger -> X (CSS lines) */
.crn-icon{position:absolute;top:50%;right:var(--pad);width:var(--icon-w);pointer-events:none}
.crn-icon::before,.crn-icon::after{content:"";position:absolute;top:50%;left:0;width:0;height:0;
  background:var(--icon)}
.crn-icon::before{transform:translateY(-150%);
  transition:background-color .88s linear,transform .88s cubic-bezier(.65,0,0,1),
    width .75s cubic-bezier(.65,0,0,1) .92s,height .75s cubic-bezier(.65,0,0,1) .92s}
.crn-icon::after{transform:translateY(150%);
  transition:background-color .88s linear,transform .88s cubic-bezier(.65,0,0,1),
    width .75s cubic-bezier(.65,0,0,1) 1.02s,height .75s cubic-bezier(.65,0,0,1) 1.02s}
.crn-stage[data-state="visible"] .crn-icon::before,.crn-stage[data-state="visible"] .crn-icon::after,
.crn-stage[data-state="open"] .crn-icon::before,.crn-stage[data-state="open"] .crn-icon::after{
  width:var(--icon-w);height:var(--icon-t)}
.crn-stage[data-state="open"] .crn-icon::before{transform:translateY(-50%) rotate(45deg)}
.crn-stage[data-state="open"] .crn-icon::after{transform:translateY(-50%) rotate(-45deg)}

/* ---------- keyframes ---------- */
@keyframes crn-rise{from{opacity:0;transform:translateY(28px);filter:blur(8px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes crn-line{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes crn-float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-4cqw,3cqw) scale(1.12)}}
@keyframes crn-sheen{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes crn-shimmer{0%,55%{left:-40%}100%{left:130%}}
@keyframes crn-pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--color-accent) 60%,transparent)}100%{box-shadow:0 0 0 10px transparent}}
@keyframes crn-dot{0%{box-shadow:0 0 0 0 currentColor}70%,100%{box-shadow:0 0 0 7px transparent}}

@media (prefers-reduced-motion:reduce){
  .crn-stage *,.crn-stage *::before,.crn-stage *::after{
    transition-duration:.01ms!important;transition-delay:0s!important;
    animation-duration:.01ms!important;animation-iteration-count:1!important;animation-delay:0s!important}
}
`;

export default function ColorRailNav({
  links = DEFAULT_LINKS,
}) {
  const [state, setState] = useState("initial"); // initial | visible | open
  const [active, setActive] = useState(links[0]?.label ?? "");
  const open = state === "open";

  // mount hone ke baad rail "andar aaye"
  useEffect(() => {
    const t = setTimeout(() => setState("visible"), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setState("visible");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="crn-root">
      <style>{CSS}</style>
      <div className="crn-stage" data-state={state}>
        <div className="crn-backdrop" onClick={() => setState("visible")} />

        <nav className="crn-nav" aria-label="Color Rail navigation" aria-hidden={!open}>
          {links.map((item, i) => (
            <a
              key={item.label}
              className="crn-item"
              href={`#color-rail-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              tabIndex={open ? 0 : -1}
              title={item.label}
              style={{ "--i": i, "--bg": item.bg, "--fg": item.fg }}
              onClick={(e) => {
                e.preventDefault();
                // rail pe click = menu khul jaye; khule menu me click = select + close
                if (!open) {
                  setState("open");
                  return;
                }
                setActive(item.label);
                setState("visible");
              }}
            >
              <div className="crn-inner">
                <span className="crn-title">
                  {active === item.label && <span className="crn-dot" />}
                  {item.label}
                </span>
                {item.image && (
                  <div className="crn-img">
                    <img src={item.image} alt="" decoding="async" />
                  </div>
                )}
                <span className="crn-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="crn-toggle"
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setState(open ? "visible" : "open")}
        >
          <span className="crn-toggle-text">{open ? "Close" : "Open"}</span>
          <span className="crn-icon" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
