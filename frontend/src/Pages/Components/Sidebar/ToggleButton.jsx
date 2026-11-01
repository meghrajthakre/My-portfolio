import { motion, useReducedMotion } from "motion/react"

import Tooltip from "../../../common/Tooltip"
import { cn } from "../../../lib/utils"

const MotionButton = motion.button
const MotionRect = motion.rect
const MotionLine = motion.line

const SPRING = { type: "spring", stiffness: 600, damping: 30 }

// Claude-style "sidebar" glyph: a rounded frame with a divider near the left.
// Open  -> the left pane is filled in, the divider sits at rest.
// Closed -> the pane is empty; on hover the divider nudges right and a ghost
//           of the pane appears, hinting at what a click will do.
const paneVariants = {
  open: { opacity: 0.35, scaleX: 1 },
  closed: { opacity: 0, scaleX: 0.6 },
  hover: (open) => (open ? { opacity: 0.55, scaleX: 1 } : { opacity: 0.2, scaleX: 1 }),
}

const dividerVariants = {
  open: { x: 0 },
  closed: { x: 0 },
  hover: (open) => ({ x: open ? -0.75 : 0.75 }),
}

export function ToggleButton({ open, onClick, listId }) {
  const reduceMotion = useReducedMotion()
  const label = open ? "Collapse component list" : "Expand component list"
  const transition = reduceMotion ? { duration: 0 } : SPRING

  return (
    <div className="absolute top-2.5 left-[5px] z-10">
      <Tooltip text={label} placement="right" hoverOnly>
        <MotionButton
          type="button"
          onClick={onClick}
          aria-expanded={open}
          aria-controls={listId}
          aria-label={label}
          data-state={open ? "open" : "closed"}
          initial={false}
          animate={open ? "open" : "closed"}
          whileHover="hover"
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          transition={transition}
          className={cn(
            "group relative flex size-9 cursor-pointer items-center justify-center rounded-lg bg-transparent outline-hidden",
            "text-foreground/60 transition-[color,background-color] duration-200 ease-out",
            "hover:bg-muted",
            "hover:text-foreground",
            "data-[state=open]:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-foreground/30"
          )}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="size-5"
          >
            {/* Left pane fill */}
            <MotionRect
              x="2.75"
              y="2.75"
              width="4.5"
              height="14.5"
              rx="2"
              fill="currentColor"
              style={{ originX: 0 }}
              variants={paneVariants}
              custom={open}
              transition={transition}
            />
            {/* Frame */}
            <rect
              x="2.25"
              y="2.25"
              width="15.5"
              height="15.5"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* Divider */}
            <MotionLine
              x1="7.5"
              y1="3"
              x2="7.5"
              y2="17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={dividerVariants}
              custom={open}
              transition={transition}
            />
          </svg>
        </MotionButton>
      </Tooltip>
    </div>
  )
}