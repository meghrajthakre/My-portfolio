import { memo, useEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "../lib/utils"

const MotionAnchor = motion.a
const MotionSpan = motion.span

// Idle ticks are 30px wide; the active / hovered tick stretches to 50px and
// pushes its label 20px to the right. The line is drawn at its widest size and
// scaled with a transform, so the spring never forces a re-layout of the list.
const LINE_IDLE = 30
const LINE_ACTIVE = 50
const LABEL_SHIFT = LINE_ACTIVE - LINE_IDLE

const lineVariants = {
  normal: { scaleX: LINE_IDLE / LINE_ACTIVE },
  active: { scaleX: 1 },
  hover: { scaleX: 1 },
}

const labelVariants = {
  normal: { x: 0 },
  active: { x: LABEL_SHIFT },
  hover: { x: LABEL_SHIFT },
}

const SPRING = { type: "spring", stiffness: 600, damping: 30 }

function getScrollParent(node) {
  let parent = node.parentElement
  while (parent) {
    const { overflowY } = getComputedStyle(parent)
    const scrollable = overflowY === "auto" || overflowY === "scroll"
    if (scrollable && parent.scrollHeight > parent.clientHeight) return parent
    parent = parent.parentElement
  }
  return null
}

// Centers `node` inside its nearest scrollable ancestor without ever scrolling
// the page itself (unlike Element.scrollIntoView).
function centerInScrollParent(node, behavior) {
  const parent = getScrollParent(node)
  if (!parent) return
  const nodeRect = node.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()
  const offset =
    nodeRect.top - parentRect.top - parent.clientHeight / 2 + nodeRect.height / 2
  parent.scrollTo({ top: parent.scrollTop + offset, behavior })
}

export function LineNav({
  className,
  items,
  activeHref,
  scrollActiveIntoView = true,
  onItemClick,
  "aria-label": ariaLabel = "Components",
}) {
  const activeItemRef = useRef(null)
  const hasCenteredRef = useRef(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = activeItemRef.current
    if (!scrollActiveIntoView || !node) return
    // Jump on first paint, glide on later selections.
    const behavior = hasCenteredRef.current && !reduceMotion ? "smooth" : "auto"
    centerInScrollParent(node, behavior)
    hasCenteredRef.current = true
  }, [scrollActiveIntoView, activeHref, reduceMotion])

  return (
    <nav
      aria-label={ariaLabel}
      // 10.25px gap + three 1px ticks per item = the 33.75px row pitch.
      className={cn("flex flex-col gap-[10.25px] py-5", className)}
      style={{ "--line-nav-width": `${LINE_IDLE}px` }}
    >
      {items.map((item, index) => {
        const isActive = item.href === activeHref

        return (
          <LineNavItem
            key={item.href}
            ref={isActive ? activeItemRef : undefined}
            title={item.title}
            href={item.href}
            badge={item.badge}
            active={isActive}
            isLast={index === items.length - 1}
            reduceMotion={reduceMotion}
            onClick={
              onItemClick ? (event) => onItemClick(item, event) : undefined
            }
          />
        )
      })}
    </nav>
  )
}

const LineNavItem = memo(function LineNavItem({
  ref,
  title,
  href,
  badge = false,
  active = false,
  isLast = false,
  reduceMotion = false,
  onClick,
}) {
  const transition = reduceMotion ? { duration: 0 } : SPRING

  return (
    <>
      {/*
        Rendered as a plain anchor to stay framework-agnostic. For client-side
        navigation in Next.js, swap `motion.a` for `motion.create(Link)`
        (import Link from "next/link").
      */}
      <MotionAnchor
        ref={ref}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex h-px items-center gap-[15px] outline-hidden",
          // Oversized hit area (28px tall) around the 1px row; doubles as the focus ring.
          "after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:rounded-md after:p-3.5",
          "focus-visible:after:ring-2 focus-visible:after:ring-foreground/30"
        )}
        href={href}
        initial={false}
        animate={active ? "active" : "normal"}
        whileHover="hover"
        onClick={onClick}
      >
        <span
          aria-hidden="true"
          className="relative block h-px shrink-0"
          style={{ width: LINE_IDLE }}
        >
          <MotionSpan
            className="absolute top-0 left-0 block h-px origin-left bg-foreground/25 transition-[background-color] ease-out group-hover:bg-foreground group-focus-visible:bg-foreground group-aria-[current=page]:bg-foreground"
            style={{ width: LINE_ACTIVE }}
            variants={lineVariants}
            transition={transition}
          />
        </span>
        <MotionSpan
          className="flex items-center gap-2 text-base whitespace-nowrap text-muted-foreground transition-[color] ease-out group-hover:text-foreground group-focus-visible:text-foreground group-aria-[current=page]:text-foreground"
          variants={labelVariants}
          transition={transition}
        >
          {title}
          {badge && (
            <>
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-blue-500"
              />
              <span className="sr-only">New</span>
            </>
          )}
        </MotionSpan>
      </MotionAnchor>
      {!isLast && (
        <>
          <span
            aria-hidden="true"
            className="block h-px w-(--line-nav-width) bg-foreground/25"
          />
          <span
            aria-hidden="true"
            className="block h-px w-(--line-nav-width) bg-foreground/25"
          />
        </>
      )}
    </>
  )
})