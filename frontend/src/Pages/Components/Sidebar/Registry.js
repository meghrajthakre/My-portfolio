import { lazy } from "react";

import LineNavDemo from "./LineNavDemo";

const HumanScan = lazy(() => import("../human-scan/HumanScan"));

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// One entry per page. `badge: true` shows the blue "new" dot in the nav.
const define = ({ title, ...rest }) => {
  const id = slugify(title);
  return { id, title, href: `#${id}`, ...rest };
};

export const COMPONENTS = [
  define({ title: "Line Nav", component: LineNavDemo, badge: true }),
  define({
    title: "Human Scan",
    component: HumanScan,
    description: "An interactive 3D scan that reveals its inner structure as you move your pointer across it.",
  }),
  ...[
    "Mobius Loop Icon",
    "Pull Quote",
    "React Wheel Picker",
    "Scroll Fade Effect",
    "Share Menu",
    "Shimmering Text",
    "Slide to Unlock",
    "Spinning Circular Text",
    "Spotlight Logo",
    "Status Button",
    "Swipe Actions",
    "Testimonial",
    "Testimonial Spotlight",
    "Testimonials Marquee",
    "Text Flip",
    "Theme Switcher",
    "Theme Toggle Effect",
    "Timescale",
    "TOC Minimap",
    "Twemoji",
  ].map((title) =>
    define({
      title,
      description: `An interactive ${title.toLowerCase()} demo.`,
    }),
  ),
];