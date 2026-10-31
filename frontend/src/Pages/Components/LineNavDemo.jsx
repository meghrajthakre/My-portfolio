import { useCallback, useState } from "react";

import { LineNav } from "../../components/line-nav";
import { ComponentsSidebar } from "./ComponentsSidebar";

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Demo links for the full panel. Selecting one just moves the highlight.
const PANEL_ITEMS = [
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
  "Work Experience",
].map((title) => ({
  title,
  href: `#demo-${slugify(title)}`,
  badge: title === "Swipe Actions",
}));

const BASIC_ITEMS = [
  { title: "Overview", href: "#basic-overview" },
  { title: "Projects", href: "#basic-projects" },
  { title: "About", href: "#basic-about" },
  { title: "Contact", href: "#basic-contact", badge: true },
];

function useSelection(initialHref) {
  const [activeHref, setActiveHref] = useState(initialHref);
  const onItemClick = useCallback((item, event) => {
    event.preventDefault();
    setActiveHref(item.href);
  }, []);
  return [activeHref, onItemClick];
}

function DemoHeading({ title, description }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
        {description}
      </p>
    </div>
  );
}

export default function LineNavDemo() {
  const [panelHref, onPanelClick] = useSelection("#demo-shimmering-text");
  const [basicHref, onBasicClick] = useSelection(BASIC_ITEMS[0].href);

  const basicTitle = BASIC_ITEMS.find((item) => item.href === basicHref)?.title;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Components
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Line Nav</h1>
      <p className="mt-2 max-w-prose text-[var(--color-secondary-text)]">
        A vertical tick-mark navigation. Hover, focus or select a link to
        stretch its line and slide the label across.
      </p>

      <section className="mt-10">
        <DemoHeading
          title="Panel"
          description="A long list in a scrolling panel. The ends fade out as you scroll, and the icon collapses the list."
        />
        <ComponentsSidebar
          className="mt-4 w-full max-w-[300px]"
          label="Panel demo"
          items={PANEL_ITEMS}
          activeHref={panelHref}
          onItemClick={onPanelClick}
          collapseOnSelect={false}
          listClassName="max-h-[34rem] lg:max-h-[34rem]"
        />
      </section>

      <section className="mt-12">
        <DemoHeading
          title="Basic"
          description="The bare nav with a few links and a new-item dot."
        />
        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-[15px] pb-5">
          <LineNav
            aria-label="Basic demo"
            className="w-fit"
            items={BASIC_ITEMS}
            activeHref={basicHref}
            scrollActiveIntoView={false}
            onItemClick={onBasicClick}
          />
          <p className="text-xs text-[var(--color-muted)]" aria-live="polite">
            Selected: {basicTitle}
          </p>
        </div>
      </section>
    </div>
  );
}