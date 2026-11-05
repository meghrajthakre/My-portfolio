import { Suspense, useCallback, useEffect, useRef, useSyncExternalStore } from "react";

import { COMPONENTS } from "./Sidebar/Registry";
import { ComponentsSidebar } from "./Sidebar/Sidebar";
import ComponentsDirectory from "./ComponentsDirectory";
import leftArrowIcon from "./assets/left-arrow-icon.svg";
import rightArrowIcon from "./assets/right-arrow-icon.svg";

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
      <span className="flex items-center gap-2 text-sm font-medium">
        {!isNext && (
          <img
            src={leftArrowIcon}
            alt=""
            aria-hidden="true"
            className="size-5 shrink-0 invert dark:invert-0"
          />
        )}
        <span className="truncate">{item.title}</span>
        {isNext && (
          <img
            src={rightArrowIcon}
            alt=""
            aria-hidden="true"
            className="size-5 shrink-0 invert dark:invert-0"
          />
        )}
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

function ComponentLoading({ title }) {
  return (
    <div
      className="grid min-h-64 place-items-center rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-secondary-text)]"
      role="status"
      aria-live="polite"
    >
      Loading {title}...
    </div>
  );
}

const Components = () => {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  const foundIndex = COMPONENTS.findIndex((item) => item.href === hash);
  const active = foundIndex === -1 ? null : COMPONENTS[foundIndex];
  const activeTitle = active?.title;
  const previous = foundIndex > 0 ? COMPONENTS[foundIndex - 1] : null;
  const next = foundIndex >= 0 ? COMPONENTS[foundIndex + 1] : null;
  const ActiveComponent = active?.component;

  const isFirstRender = useRef(true);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = activeTitle ? `${activeTitle} · Components` : "Components";
    return () => {
      document.title = previousTitle;
    };
  }, [activeTitle]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
  }, [active?.id]);

  const handleItemClick = useCallback((item, event) => {
    // Leave modified / middle clicks to the browser (open in new tab, etc.).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(item.href);
  }, []);

  if (!active) {
    return (
      <div className="text-[var(--color-text)]">
        <ComponentsDirectory onItemClick={handleItemClick} />
      </div>
    );
  }

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
          collapseOnSelect={false}
        />
      </aside>

      <main className="mx-auto w-full max-w-3xl px-6 sm:px-8">
        <a
          href="/components"
          onClick={(event) => {
            event.preventDefault();
            navigate("");
          }}
          className="mb-8 inline-flex items-center gap-2 rounded-md text-sm text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
        >
          <span aria-hidden="true">←</span>
          All components
        </a>

        <article className="min-w-0">
          {ActiveComponent ? (
            <Suspense fallback={<ComponentLoading title={active.title} />}>
              <ActiveComponent />
            </Suspense>
          ) : (
            <DemoPlaceholder
              title={active.title}
              description={active.description}
            />
          )}

          <nav
            aria-label="Component pagination"
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