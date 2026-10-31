import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

import { ComponentsSidebar } from "./ComponentsSidebar";
import { COMPONENTS } from "./Registry";

// Tiny hash router: the URL hash picks the page, so it works with any framework
// and gives every component a shareable link with working back/forward.
const subscribe = (callback) => {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
};
const getHash = () => window.location.hash;
const getServerHash = () => "";

function navigate(href) {
  if (window.location.hash === href) return;
  // pushState avoids the browser jumping to an element with a matching id.
  window.history.pushState(null, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function PagerLink({ item, direction, onClick }) {
  const isNext = direction === "next";

  return (
    <a
      href={item.href}
      onClick={(event) => onClick(item, event)}
      className={`group flex min-w-0 flex-col gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--color-card-bg)] ${
        isNext ? "ml-auto items-end text-right" : "items-start"
      }`}
    >
      <span className="text-xs text-[var(--color-muted)]">
        {isNext ? "Next" : "Previous"}
      </span>
      <span className="truncate text-sm font-medium">
        {isNext ? `${item.title} →` : `← ${item.title}`}
      </span>
    </a>
  );
}

function DemoPlaceholder({ title, description }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Components
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 max-w-prose text-[var(--color-secondary-text)]">
          {description}
        </p>
      )}
      <div className="mt-8 grid min-h-64 place-items-center rounded-xl border border-dashed border-[var(--color-border)] text-sm text-[var(--color-muted)]">
        Demo preview coming soon
      </div>
    </div>
  );
}

const Components = () => {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  const foundIndex = COMPONENTS.findIndex((item) => item.href === hash);
  const activeIndex = foundIndex === -1 ? 0 : foundIndex;
  const active = COMPONENTS[activeIndex];
  const previous = COMPONENTS[activeIndex - 1];
  const next = COMPONENTS[activeIndex + 1];
  const ActiveComponent = active.component;

  const isFirstRender = useRef(true);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${active.title} · Components`;
    return () => {
      document.title = previousTitle;
    };
  }, [active.title]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
  }, [active.id]);

  const handleItemClick = useCallback((item, event) => {
    // Leave modified / middle clicks to the browser (open in new tab, etc.).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(item.href);
  }, []);

  return (
    <div className="min-h-[70vh] py-8 text-[var(--color-text)] lg:py-12">
      <aside
        className="mx-auto mb-6 w-full max-w-64 px-4 xl:fixed xl:top-24 xl:z-30 xl:mb-0 xl:w-64 xl:max-w-none xl:px-0"
        style={{
          left: "max(0.75rem, calc((100vw - 48rem) / 2 - 19rem))",
        }}
      >
        <ComponentsSidebar
          items={COMPONENTS}
          activeHref={active.href}
          onItemClick={handleItemClick}
        />
      </aside>

      <main className="mx-auto min-h-[70vh] w-full max-w-3xl px-8">
        <article className="min-w-0">
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <DemoPlaceholder
              title={active.title}
              description={active.description}
            />
          )}

          <nav
            aria-label="Pagination"
            className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6"
          >
            {previous && (
              <PagerLink
                item={previous}
                direction="previous"
                onClick={handleItemClick}
              />
            )}
            {next && (
              <PagerLink
                item={next}
                direction="next"
                onClick={handleItemClick}
              />
            )}
          </nav>
        </article>
      </main>
    </div>
  );
};

export default Components;