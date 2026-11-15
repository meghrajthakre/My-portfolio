import { useEffect, useState } from "react";

/*
 * Images: abhi koi internet/URL nahi chahiye. Neeche ke "architecture" graphics
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
  `<rect width="600" height="600" fill="#d9d9d9"/>` +
    range(6)
      .map((r) =>
        range(5)
          .map(
            (c) =>
              `<rect x="${40 + c * 105}" y="${40 + r * 92}" width="80" height="62" fill="${
                (r + c) % 3 === 0 ? "#2f2f2f" : "#8a8a8a"
              }"/><rect x="${34 + c * 105}" y="${106 + r * 92}" width="92" height="6" fill="#555"/>`
          )
          .join("")
      )
      .join("")
);

// 2) diagonal slab
const slab = svg(
  `<rect width="600" height="600" fill="#f3f3f3"/>
   <polygon points="0,430 600,110 600,190 0,510" fill="#3d3d3d"/>
   <polygon points="0,510 600,190 600,222 0,546" fill="#9a9a9a"/>
   ${range(10)
     .map((i) => `<rect x="${i * 62}" y="${470 - i * 32}" width="6" height="${130 + i * 30}" fill="#bdbdbd"/>`)
     .join("")}`
);

// 3) interior / hall
const hall = svg(
  `<rect width="600" height="600" fill="#f5f5f5"/>
   <polygon points="0,380 600,380 600,600 0,600" fill="#dedede"/>
   ${range(5).map((i) => `<rect x="${60 + i * 120}" y="90" width="16" height="290" fill="#b9b9b9"/>`).join("")}
   ${range(8).map((i) => `<rect x="0" y="${60 + i * 6}" width="600" height="2" fill="#e4e4e4"/>`).join("")}
   <circle cx="210" cy="470" r="12" fill="#333"/><rect x="200" y="482" width="20" height="46" rx="8" fill="#333"/>
   <circle cx="400" cy="500" r="12" fill="#333"/><rect x="390" y="512" width="20" height="46" rx="8" fill="#333"/>`
);

// 4) fluted wall + figure
const fluted = svg(
  `<rect width="600" height="600" fill="#dcdcdc"/>
   ${range(30).map((i) => `<rect x="${i * 20}" y="0" width="11" height="600" fill="#b4b4b4"/>`).join("")}
   <rect x="330" y="80" width="150" height="440" fill="#f0f0f0"/>
   <rect x="440" y="230" width="10" height="90" fill="#222"/>
   <rect x="370" y="170" width="64" height="300" rx="30" fill="#1f1f1f" opacity=".85"/>`
);

// 5) blocks / skyline
const heights = [200, 320, 260, 430, 300, 380, 240, 340];
const blocks = svg(
  `<rect width="600" height="600" fill="#e8e8e8"/>` +
    heights
      .map(
        (h, i) =>
          `<rect x="${i * 75}" y="${600 - h}" width="66" height="${h}" fill="${i % 2 ? "#4b4b4b" : "#7d7d7d"}"/>` +
          range(Math.floor(h / 40))
            .map((r) => `<rect x="${i * 75 + 10}" y="${600 - h + 14 + r * 40}" width="46" height="14" fill="#dedede"/>`)
            .join("")
      )
      .join("")
);

// 6) stepped tower
const tower = svg(
  `<rect width="600" height="600" fill="#ececec"/>` +
    [400, 320, 240, 160]
      .map((w, i) => {
        const y = 600 - (i + 1) * 130;
        return (
          `<rect x="${300 - w / 2}" y="${y}" width="${w}" height="130" fill="${["#4a4a4a", "#6a6a6a", "#8c8c8c", "#adadad"][i]}"/>` +
          range(Math.floor(w / 40))
            .map((c) => `<rect x="${300 - w / 2 + 14 + c * 40}" y="${y + 20}" width="22" height="90" fill="#e2e2e2"/>`)
            .join("")
        );
      })
      .join("")
);

const DEFAULT_LINKS = [
  { label: "Home", bg: "#ff2800", fg: "#ffffff", image: facade },
  { label: "Projects", bg: "#ffffff", fg: "#656657", image: slab },
  { label: "About us", bg: "#ebeae1", fg: "#656657", image: hall },
  { label: "News and insights", bg: "#656657", fg: "#ebeae1", image: fluted },
  { label: "Vacancies", bg: "#4fbafa", fg: "#12366b", image: blocks },
  { label: "Contact", bg: "#8746e3", fg: "#ffffff", image: tower },
];

/* Hamburger / X ka color yahan badlo */
const ICON_COLOR_CLOSED = "#1a1630"; // hamburger (red button ke upar)
const ICON_COLOR_OPEN = "#ff2800"; // X (white button ke upar)

/*
 * SIZE: navbar ko bada/chhota karna ho to niche ke --bar-w, --bar-h, --rail-h,
 * --fs (button text), --col-h (column height) badlo.
 * Har size `max(<% of width>, <minimum px>)` hai, to chhote preview me bhi
 * navbar kabhi minimum se chhota nahi hoga.
 */
const CSS = `
.crn-root{container:crn/inline-size;width:100%}
.crn-stage{
  --bar-w:max(24cqw,300px);      /* Open button + rail ki width */
  --bar-h:max(3.6cqw,52px);      /* Open button ki height */
  --rail-h:max(1.6cqw,24px);     /* neeche ki color rail ki height */
  --bar-gap:max(1.6cqw,24px);    /* button aur neeche ke beech ka gap */
  --fs:max(1.05cqw,17px);        /* button text size */
  --icon-w:max(1.5cqw,26px);     /* hamburger width */
  --icon-t:max(.14cqw,3px);      /* hamburger line thickness */
  --pad:max(1.6cqw,24px);        /* button ke andar side padding */
  --col-h:max(24.3229cqw,340px); /* khule column ki height */
  --title-fs:max(1.4cqw,18px);   /* column label size */
  --title-pad:max(1cqw,16px);    /* column label ka top/left */
  --dot:max(.7cqw,10px);         /* active dot */

  position:relative;width:100%;min-height:max(56.25cqw,520px);overflow:hidden;
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;
  --tbg:#ff2800;--tfg:#ffffff;--icon:${ICON_COLOR_CLOSED}}
.crn-stage[data-state="open"]{--tbg:#ffffff;--tfg:#656657;--icon:${ICON_COLOR_OPEN}}

/* ---------- dim backdrop (click = close) ---------- */
.crn-backdrop{position:absolute;inset:0;z-index:1;background:#000000b3;opacity:0;
  pointer-events:none;transition:opacity .98s linear}
.crn-stage[data-state="open"] .crn-backdrop{opacity:.4;pointer-events:auto;cursor:pointer;
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
  transition:all .98s cubic-bezier(.65,0,0,1);
  transition-delay:calc((var(--i) + 1) * 50ms)}
.crn-stage[data-state="visible"] .crn-item{width:16.6667%;height:var(--rail-h)}
.crn-stage[data-state="open"] .crn-item{width:16.6667%;height:var(--col-h)}

.crn-inner{position:relative;width:100%;height:0;overflow:hidden;transform-origin:top;
  transition:height .88s cubic-bezier(.65,0,0,1) 50ms,opacity .4s cubic-bezier(.65,0,0,1) 50ms}
.crn-stage[data-state="initial"] .crn-inner,
.crn-stage[data-state="visible"] .crn-inner{opacity:0}
.crn-stage[data-state="open"] .crn-inner{height:calc(var(--col-h) * .9315);transition-delay:.1s}

.crn-title{position:absolute;top:var(--title-pad);left:var(--title-pad);display:flex;align-items:center;
  gap:calc(var(--dot) * .7);font-size:var(--title-fs);font-weight:500;line-height:132%;white-space:nowrap}
.crn-dot{flex-shrink:0;display:inline-block;width:var(--dot);height:var(--dot);background:currentColor}

/* ---------- image (grayscale + column color tint, hover pe asli color) ---------- */
.crn-img{position:absolute;left:17.5%;width:65%;aspect-ratio:1/1;overflow:hidden;
  top:max(6.77083cqw,calc(var(--title-pad) * 2 + var(--title-fs) * 1.6));
  transition:transform .92s cubic-bezier(.5,0,0,1)}
.crn-img::after{content:"";position:absolute;inset:0;background:var(--bg);mix-blend-mode:overlay;
  transition:opacity .92s cubic-bezier(.5,0,0,1)}
.crn-img img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;
  filter:grayscale(1);transition:transform .92s cubic-bezier(.5,0,0,1),filter .92s cubic-bezier(.5,0,0,1)}
.crn-item:hover .crn-img{transform:scale(1.05)}
.crn-item:hover .crn-img::after{opacity:0}
.crn-item:hover .crn-img img{filter:grayscale(0);transform:scale(1.05)}

/* ---------- Open / Close button ---------- */
.crn-toggle{position:absolute;left:50%;bottom:var(--bar-gap);z-index:3;transform:translateX(-50%);
  display:flex;align-items:center;width:0;height:0;padding:0;border:0;overflow:hidden;
  cursor:pointer;font:inherit;background:var(--tbg);color:var(--tfg);
  transition:background-color .88s linear,color .88s linear,
    height .98s cubic-bezier(.65,0,0,1) .45s,width .98s cubic-bezier(.65,0,0,1) .23s,
    opacity .48s cubic-bezier(.48,0,.03,1)}
.crn-stage[data-state="visible"] .crn-toggle,
.crn-stage[data-state="open"] .crn-toggle{width:var(--bar-w);height:var(--bar-h)}

.crn-toggle-text{position:relative;padding-left:var(--pad);font-size:var(--fs);font-weight:500;
  line-height:130%;letter-spacing:.01em;color:inherit;opacity:0;transform:translate(calc(var(--pad) * .8));
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

@media (prefers-reduced-motion:reduce){
  .crn-stage *,.crn-stage *::before,.crn-stage *::after{
    transition-duration:.01ms!important;transition-delay:0s!important}
}
`;

export default function ColorRailNav({ links = DEFAULT_LINKS }) {
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