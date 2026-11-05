import { Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Linkedin,
  MoreHorizontal,
  Share2,
  Twitter,
} from "lucide-react";

import Tooltip from "../../common/Tooltip";
import { COMPONENTS } from "./Sidebar/Registry";
import { ComponentsSidebar } from "./Sidebar/Sidebar";
import ComponentsDirectory from "./ComponentsDirectory";

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
  const target = href || `${window.location.pathname}${window.location.search}`;
  if (window.location.hash === href) return;
  // pushState avoids the browser jumping to an element with a matching id.
  window.history.pushState(null, "", target);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ---------- toolbar (back link, share, prev / next) ---------- */

// Theme-tinted toolbar control shared by the share and navigation buttons.
const BUTTON =
  "inline-flex h-8 w-8 select-none items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)] text-[var(--color-text)] transition-[transform,background-color] duration-150 ease-out hover:bg-[color-mix(in_srgb,var(--color-text)_12%,transparent)] active:scale-90 active:bg-[color-mix(in_srgb,var(--color-text)_18%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] motion-reduce:transition-none motion-reduce:active:scale-100";

const MENU_ITEM =
  "flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm transition-[transform,background-color] duration-150 hover:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] motion-reduce:transition-none motion-reduce:active:scale-100";

const ICON = "h-3.5 w-3.5 shrink-0";

// Briefly flips to `true` after something was copied, then resets.
function useFlash(ms = 1600) {
  const [on, setOn] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const flash = useCallback(() => {
    setOn(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(false), ms);
  }, [ms]);
  return [on, flash];
}

function ShareButton({ title }) {
  const [copied, flash] = useFlash();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    setStatus(success ? "Link copied" : "Could not copy link");
    if (success) flash();
    setOpen(false);
  };

  const shareTo = (service) => {
    const url = window.location.href;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const shareUrl =
      service === "x"
        ? `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const shareOther = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to share the component link.", error);
          setStatus("Could not share link");
        }
      }
    } else {
      await copyLink();
    }
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <Tooltip text={copied ? "Link copied" : "Share"} hoverOnly>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={copied ? "Link copied" : "Share"}
          aria-haspopup="true"
          aria-expanded={open}
          className={BUTTON}
        >
          {copied ? (
            <Check className={`${ICON} text-[var(--color-accent)]`} aria-hidden="true" />
          ) : (
            <Share2 className={ICON} aria-hidden="true" />
          )}
        </button>
      </Tooltip>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 origin-top-right rounded-2xl border border-dashed border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_78%,transparent)] p-1.5 text-[var(--color-text)] shadow-xl backdrop-blur-2xl">
          <button type="button" onClick={copyLink} className={MENU_ITEM}>
            {copied ? (
              <Check className={ICON} aria-hidden="true" />
            ) : (
              <Copy className={ICON} aria-hidden="true" />
            )}
            Copy link
          </button>
          <button type="button" onClick={() => shareTo("x")} className={MENU_ITEM}>
            <Twitter className={ICON} aria-hidden="true" />
            Share on X
          </button>
          <button type="button" onClick={() => shareTo("linkedin")} className={MENU_ITEM}>
            <Linkedin className={ICON} aria-hidden="true" />
            Share on LinkedIn
          </button>
          <button type="button" onClick={shareOther} className={MENU_ITEM}>
            <MoreHorizontal className={ICON} aria-hidden="true" />
            Other app
          </button>
          <span className="sr-only" role="status" aria-live="polite">{status}</span>
        </div>
      )}
    </div>
  );
}

function StepButton({ item, direction, onClick }) {
  const isNext = direction === "next";
  const label = isNext ? "Next component" : "Previous component";
  const icon = isNext
    ? <ArrowRight className={ICON} aria-hidden="true" />
    : <ArrowLeft className={ICON} aria-hidden="true" />;

  if (!item) {
    return (
      <Tooltip text={label} hoverOnly>
        <span
          aria-disabled="true"
          aria-label={label}
          className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-[var(--color-text)] opacity-40"
        >
          {icon}
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip text={`${label}: ${item.title}`} hoverOnly>
      <a
        href={item.href}
        onClick={(event) => onClick(item, event)}
        aria-label={`${label}: ${item.title}`}
        className={BUTTON}
      >
        {icon}
      </a>
    </Tooltip>
  );
}

function Toolbar({ title, previous, next, onItemClick }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-3">
      <a
        href="/components"
        onClick={(event) => {
          event.preventDefault();
          navigate("");
        }}
        className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        Components
      </a>

      <div className="flex items-center gap-2">
        <ShareButton title={title} />
        <div className="flex items-center gap-1">
          <StepButton item={previous} direction="previous" onClick={onItemClick} />
          <StepButton item={next} direction="next" onClick={onItemClick} />
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

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
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span className="truncate">{item.title}</span>
        {isNext && (
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
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
      className="grid min-h-64 place-items-center rounded-xl border border-dashed border-[var(--color-border)] text-sm text-[var(--color-secondary-text)]"
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
      {/* Below xl the sidebar sits in the same column as the content (same
          max width + side padding) so its left edge lines up with everything
          else. From xl up it floats fixed in the left gutter. */}
      <aside
        className="mx-auto mb-6 w-full max-w-3xl px-6 sm:px-8 xl:fixed xl:top-24 xl:z-30 xl:mb-0 xl:w-64 xl:max-w-none xl:px-0"
        style={{
          left: "max(0.75rem, calc((100vw - 48rem) / 2 - 19rem))",
        }}
      >
        <div className="max-w-64 xl:max-w-none">
          <ComponentsSidebar
            items={COMPONENTS}
            activeHref={active.href}
            onItemClick={handleItemClick}
            collapseOnSelect={false}
          />
        </div>
      </aside>

      <main className="mx-auto w-full max-w-3xl px-6 sm:px-8">
        <Toolbar
          title={active.title}
          previous={previous}
          next={next}
          onItemClick={handleItemClick}
        />

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

          {/* -mx-3 cancels the links' own px-3, so the Previous / Next text
              lines up with the left and right edges of the content above. */}
          <nav
            aria-label="Component pagination"
            className="-mx-3 mt-12 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6"
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