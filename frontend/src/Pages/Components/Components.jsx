import { useCallback, useState } from "react";
import { LineNav } from "../../components/line-nav";

const LINE_NAV_DEMO_ITEMS = [
  { title: "Overview", href: "#demo-overview" },
  { title: "Projects", href: "#demo-projects" },
  { title: "About", href: "#demo-about" },
  { title: "Contact", href: "#demo-contact" },
];

function SidebarCard({ eyebrow, title, children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4 ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
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
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-3xl px-4 py-8 text-[var(--color-text)] sm:px-8 lg:py-12">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Library
        </p>
        <h1 className="mt-2 text-3xl font-bold">Components</h1>
        <p className="mt-2 text-[var(--color-secondary-text)]">
          Components that I have made.
        </p>
      </header>
      <LineNavDemo />
    </main>
  );
};

export default Components;