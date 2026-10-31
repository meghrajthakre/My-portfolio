import { useCallback, useState } from "react";
import { LineNav } from "../../components/line-nav";
import HumanScan from "./human-scan/HumanScan";

const COMPONENTS = [
  {
    id: "human-scan",
    title: "Human Scan",
    href: "#human-scan",
    component: HumanScan,
  },
];

const LINE_NAV_DEMO_ITEMS = [
  { title: "Overview", href: "#demo-overview" },
  { title: "Projects", href: "#demo-projects" },
  { title: "About", href: "#demo-about" },
  { title: "Contact", href: "#demo-contact" },
];

function SidebarCard({ eyebrow, title, titleAs: Title = "h2", children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4 ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {eyebrow}
      </p>
      <Title className="mt-2 text-lg font-semibold">{title}</Title>
      {children}
    </div>
  );
}

function LineNavDemo() {
  const [activeHref, setActiveHref] = useState(LINE_NAV_DEMO_ITEMS[0].href);
  const activeTitle = LINE_NAV_DEMO_ITEMS.find(
    (item) => item.href === activeHref,
  )?.title;

  const handleItemClick = useCallback((item, event) => {
    event.preventDefault();
    setActiveHref(item.href);
  }, []);

  return (
    <SidebarCard eyebrow="Live demo" title="Line Nav" className="mt-4">
      <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
        Hover or focus a link to magnify the line, click to select it.
      </p>
      <LineNav
        aria-label="Line nav demo"
        className="mt-4"
        items={LINE_NAV_DEMO_ITEMS}
        activeHref={activeHref}
        onItemClick={handleItemClick}
      />
      <p className="mt-3 text-xs text-[var(--color-muted)]" aria-live="polite">
        Selected: {activeTitle}
      </p>
    </SidebarCard>
  );
}

const Components = () => {
  const [activeId, setActiveId] = useState(COMPONENTS[0].id);
  const activeItem = COMPONENTS.find(({ id }) => id === activeId);
  const ActiveComponent = activeItem?.component;

  const handleItemClick = useCallback((item, event) => {
    event.preventDefault();
    setActiveId(item.id);
  }, []);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col gap-6 px-4 py-8 text-[var(--color-text)] sm:px-6 lg:flex-row lg:gap-10 lg:py-12">
      <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:h-fit lg:w-56">
        <SidebarCard eyebrow="Library" title="Components" titleAs="h1">
          <LineNav
            aria-label="Components"
            className="mt-5"
            items={COMPONENTS}
            activeHref={activeItem?.href}
            onItemClick={handleItemClick}
          />
        </SidebarCard>
        <LineNavDemo />
      </aside>

      <section className="min-w-0 flex-1" aria-label={activeItem?.title}>
        {ActiveComponent && <ActiveComponent />}
      </section>
    </div>
  );
};

export default Components;