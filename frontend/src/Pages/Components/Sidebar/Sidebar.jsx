import { useCallback, useEffect, useId, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { LineNav } from "../../../components/line-nav"
import { cn } from "../../../lib/utils"

const MotionButton = motion.button
const MotionSpan = motion.span
const MotionDiv = motion.div

const FADE_TOP = 40
const FADE_BOTTOM = 28
const SCROLL_EPSILON = 2
const MOBILE_QUERY = "(max-width: 1023px)"

const MASK =
  "linear-gradient(to bottom, transparent 0, #000 var(--fade-top, 0px), #000 calc(100% - var(--fade-bottom, 0px)), transparent 100%)"
const MASK_STYLE = { maskImage: MASK, WebkitMaskImage: MASK }

// Same spring as LineNav, so the toggle and the list feel like one system.
const SPRING = { type: "spring", stiffness: 600, damping: 30 }
// The panel moves a lot of distance, so it gets a slightly softer spring.
const PANEL_SPRING = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 }

// Three ticks, just like LineNav's lines. Idle they are short; on hover they
// stretch to full width one after another; when the list is open they settle
// into a staggered "list" shape.
const TICK_FULL = 16
const TICK_OPEN = [1, 0.62, 0.82]
const TICK_CLOSED = 0.5

const tickVariants = {
  closed: (i) => ({ scaleX: TICK_CLOSED, transition: { ...SPRING, delay: i * 0.03 } }),
  open: (i) => ({ scaleX: TICK_OPEN[i], transition: { ...SPRING, delay: i * 0.03 } }),
  hover: (i) => ({ scaleX: 1, transition: { ...SPRING, delay: i * 0.03 } }),
}

function ToggleButton({ open, onClick, listId, reduceMotion }) {
  return (
    <MotionButton
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={listId}
      aria-label={open ? "Collapse component list" : "Expand component list"}
      initial={false}
      animate={open ? "open" : "closed"}
      whileHover="hover"
      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
      transition={reduceMotion ? { duration: 0 } : SPRING}
      className={cn(
        "group absolute top-2 left-2 z-10 flex size-10 cursor-pointer items-center justify-center rounded-xl",
        "border border-foreground/10 bg-foreground/[0.04] text-foreground/80 shadow-sm backdrop-blur-sm outline-hidden",
        // Colours fade with ease-out, exactly like LineNav's label / line colours.
        "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out",
        "hover:border-foreground/20 hover:bg-foreground/10 hover:text-foreground hover:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-foreground/30"
      )}
    >
      <span
        aria-hidden="true"
        className="flex flex-col gap-[5px]"
        style={{ width: TICK_FULL }}
      >
        {TICK_OPEN.map((_, i) => (
          <MotionSpan
            key={i}
            custom={reduceMotion ? 0 : i}
            variants={tickVariants}
            className="block h-px origin-left rounded-full bg-current"
            style={{ width: TICK_FULL }}
          />
        ))}
      </span>
    </MotionButton>
  )
}

// Scroll container that only fades an edge while there is more to scroll in
// that direction, so the first / last item are never dimmed at rest.
function ScrollFade({ id, className, children }) {
  const ref = useRef(null)
  const frame = useRef(0)
  const last = useRef({ top: -1, bottom: -1 })

  const apply = useCallback(() => {
    frame.current = 0
    const el = ref.current
    if (!el) return

    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop
    const top = el.scrollTop > SCROLL_EPSILON ? FADE_TOP : 0
    const bottom = remaining > SCROLL_EPSILON ? FADE_BOTTOM : 0

    // Only touch the DOM when a value actually changes.
    if (top !== last.current.top) {
      el.style.setProperty("--fade-top", `${top}px`)
      last.current.top = top
    }
    if (bottom !== last.current.bottom) {
      el.style.setProperty("--fade-bottom", `${bottom}px`)
      last.current.bottom = bottom
    }
  }, [])

  // Coalesce scroll / resize bursts into one write per frame.
  const schedule = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(apply)
  }, [apply])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    apply()
    const observer = new ResizeObserver(schedule)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)

    return () => {
      observer.disconnect()
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [apply, schedule])

  return (
    <div
      id={id}
      ref={ref}
      onScroll={schedule}
      className={cn(
        "overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      style={MASK_STYLE}
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
  defaultOpen = true,
  listClassName,
  className,
}) {
  const [open, setOpen] = useState(defaultOpen)
  const listId = useId()
  const reduceMotion = useReducedMotion()

  const toggle = useCallback(() => setOpen((value) => !value), [])

  const handleItemClick = useCallback(
    (item, event) => {
      onItemClick?.(item, event)
      // On small screens the list sits above the content, so tuck it away.
      if (
        collapseOnSelect &&
        typeof window !== "undefined" &&
        window.matchMedia(MOBILE_QUERY).matches
      ) {
        setOpen(false)
      }
    },
    [onItemClick, collapseOnSelect]
  )

  return (
    <div
      className={cn(
        "relative min-h-[56px] overflow-hidden rounded-xl",
        className
      )}
    >
      {/* The button floats over the list, which scrolls (and fades) beneath it. */}
      <ToggleButton
        open={open}
        onClick={toggle}
        listId={listId}
        reduceMotion={reduceMotion}
      />

      {/*
        Spring-animated height (0 <-> auto) with a fade. `inert` takes the list
        out of the tab order / a11y tree while it is closed.
      */}
      <MotionDiv
        initial={false}
        animate={
          open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={reduceMotion ? { duration: 0 } : PANEL_SPRING}
        className="overflow-hidden"
        inert={!open}
      >
        <ScrollFade
          id={listId}
          className={cn(
            "max-h-[min(50dvh,24rem)] px-[15px] lg:max-h-[calc(100dvh-10rem)]",
            listClassName
          )}
        >
          <LineNav
            aria-label={label}
            className="pt-[60px] pb-6"
            items={items}
            activeHref={activeHref}
            onItemClick={handleItemClick}
          />
        </ScrollFade>
      </MotionDiv>
    </div>
  )
}