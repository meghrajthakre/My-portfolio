import { useCallback, useEffect, useId, useRef, useState } from "react"

import { LineNav } from "../../components/line-nav"
import { cn } from "../../lib/utils"

const FADE_TOP = 40
const FADE_BOTTOM = 28
const MASK =
  "linear-gradient(to bottom, transparent 0, #000 var(--fade-top, 0px), #000 calc(100% - var(--fade-bottom, 0px)), transparent 100%)"

function SidebarIcon({ className }) {
  return (
    <svg
      viewBox="0 0 18 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="0.75"
        y="0.75"
        width="16.5"
        height="12.5"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="3" y="3" width="3.5" height="8" rx="1" fill="currentColor" />
    </svg>
  )
}

// Scroll container that only fades an edge while there is more to scroll in
// that direction, so the first / last item are never dimmed at rest.
function ScrollFade({ id, className, children }) {
  const ref = useRef(null)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop
    el.style.setProperty("--fade-top", `${el.scrollTop > 2 ? FADE_TOP : 0}px`)
    el.style.setProperty(
      "--fade-bottom",
      `${remaining > 2 ? FADE_BOTTOM : 0}px`
    )
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [update])

  return (
    <div
      id={id}
      ref={ref}
      onScroll={update}
      className={cn(
        "overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      {children}
    </div>
  )
}

export function ComponentsSidebar({
  items,
  activeHref,
  onItemClick,
  label = "Components",
  collapseOnSelect = true,
  listClassName,
  className,
}) {
  const [open, setOpen] = useState(true)
  const listId = useId()

  const handleItemClick = useCallback(
    (item, event) => {
      onItemClick?.(item, event)
      // On small screens the list sits above the content, so tuck it away.
      if (collapseOnSelect && window.matchMedia("(max-width: 1023px)").matches) {
        setOpen(false)
      }
    },
    [onItemClick, collapseOnSelect]
  )

  return (
    <div
      className={cn(
        "relative min-h-[52px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)]",
        className
      )}
    >
      {/* The icon floats over the list, which scrolls (and fades) beneath it. */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={open ? "Collapse component list" : "Expand component list"}
        className="absolute top-4 left-[15px] z-10 -m-1 rounded-md p-1 text-foreground transition-opacity outline-hidden hover:opacity-70 focus-visible:ring-2 focus-visible:ring-foreground/30"
      >
        <SidebarIcon className="h-2.5 w-[18px]" />
      </button>

      <ScrollFade
        id={listId}
        className={cn(
          "max-h-[min(50dvh,24rem)] px-[15px] lg:max-h-[calc(100dvh-10rem)]",
          listClassName,
          !open && "hidden"
        )}
      >
        <LineNav
          aria-label={label}
          className="pt-[52px] pb-6"
          items={items}
          activeHref={activeHref}
          onItemClick={handleItemClick}
        />
      </ScrollFade>
    </div>
  )
}