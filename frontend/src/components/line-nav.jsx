import { memo, useEffect, useRef } from "react"
import { motion } from "motion/react"

import { cn } from "../lib/utils"

const MotionAnchor = motion.a
const MotionLine = motion.span
const LINE_WIDTH = { normal: 35, active: 60 }
const LINE_TRANSITION = { type: "spring", stiffness: 280, damping: 30, mass: 0.8 }

export function LineNav({
  className,
  items,
  activeHref,
  scrollActiveIntoView = true,
  onItemClick,
  "aria-label": ariaLabel = "Components",
}) {
  const activeItemRef = useRef(null)

  useEffect(() => {
    if (scrollActiveIntoView) {
      activeItemRef.current?.scrollIntoView({ block: "nearest" })
    }
  }, [scrollActiveIntoView, activeHref])

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "w-[300px] max-w-full rounded-2xl border border-[#27272a] bg-[#080808] p-3.5",
        className
      )}
    >
      <ul className="flex flex-col">
        {items.map((item, index) => {
          const isActive = item.href === activeHref

          return (
            <LineNavItem
              key={item.href}
              ref={isActive ? activeItemRef : undefined}
              title={item.title}
              href={item.href}
              active={isActive}
              isLast={index === items.length - 1}
              onClick={
                onItemClick ? (event) => onItemClick(item, event) : undefined
              }
            />
          )
        })}
      </ul>
    </nav>
  )
}

const LineNavItem = memo(function LineNavItem({
  ref,
  title,
  href,
  active,
  isLast,
  onClick,
}) {
  return (
    <li className="relative h-[34px]">
      <MotionAnchor
        ref={ref}
        aria-current={active ? "page" : undefined}
        className="group flex h-full items-center gap-3.5 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        href={href}
        initial={false}
        animate={active ? "active" : "normal"}
        whileHover="hover"
        onClick={onClick}
      >
        <MotionLine
          aria-hidden="true"
          className="block h-px shrink-0 bg-[#3f3f46] transition-colors duration-300 ease-out group-hover:bg-white group-aria-[current=page]:bg-white"
          variants={{
            normal: { width: LINE_WIDTH.normal },
            active: { width: LINE_WIDTH.active },
            hover: { width: LINE_WIDTH.active },
          }}
          transition={LINE_TRANSITION}
        />
        <span
          className={cn(
            "text-sm transition-colors duration-300 ease-out group-hover:!text-white group-aria-[current=page]:font-medium group-aria-[current=page]:text-white",
            active ? "font-medium text-white" : "text-[#a1a1aa]"
          )}
        >
          {title}
        </span>
      </MotionAnchor>
      {!isLast && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[28px] h-px w-[30px] bg-[#3f3f46]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[39px] h-px w-[30px] bg-[#3f3f46]"
          />
        </>
      )}
    </li>
  )
})
