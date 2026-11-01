import { motion, useReducedMotion } from "motion/react"

import Tooltip from "../../../common/Tooltip"
import { cn } from "../../../lib/utils"

const MotionButton = motion.button
const MotionSpan = motion.span

const SPRING = { type: "spring", stiffness: 600, damping: 30 }
const TICK_FULL = 16
const TICK_OPEN = [1, 0.62, 0.82]
const TICK_CLOSED = 0.5
const WAVE = 0.035

const tickTransition = ({ i, reduce }) =>
  reduce ? { duration: 0 } : { ...SPRING, delay: i * WAVE }

const tickVariants = {
  closed: (custom) => ({
    scaleX: TICK_CLOSED,
    transition: tickTransition(custom),
  }),
  open: (custom) => ({
    scaleX: TICK_OPEN[custom.i],
    transition: tickTransition(custom),
  }),
  hover: (custom) => ({
    scaleX: 1,
    transition: tickTransition(custom),
  }),
}

const buttonVariants = {
  closed: { y: 0, scale: 1 },
  open: { y: 0, scale: 1 },
  hover: { y: -1 },
  tap: { y: 0, scale: 0.94 },
}

export function ToggleButton({ open, onClick, listId }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="absolute top-2.5 left-[5px] z-10">
      <Tooltip
        text={open ? "Collapse component list" : "Expand component list"}
        placement="right"
      >
        <MotionButton
          type="button"
          onClick={onClick}
          aria-expanded={open}
          aria-controls={listId}
          aria-label={open ? "Collapse component list" : "Expand component list"}
          data-state={open ? "open" : "closed"}
          initial={false}
          animate={open ? "open" : "closed"}
          whileHover="hover"
          whileTap="tap"
          variants={reduceMotion ? undefined : buttonVariants}
          transition={reduceMotion ? { duration: 0 } : SPRING}
          className={cn(
            "group relative flex size-9 cursor-pointer items-center justify-center rounded-lg outline-hidden",
            "border border-transparent bg-background/70 text-foreground/60 backdrop-blur-sm",
            "transition-[background-color,border-color,color] duration-200 ease-out",
            "hover:border-foreground/10 hover:bg-foreground/[0.06] hover:text-foreground",
            "data-[state=open]:text-foreground/80 data-[state=open]:hover:text-foreground",
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
                custom={{ i, reduce: !!reduceMotion }}
                variants={tickVariants}
                className="block h-[1.5px] origin-left rounded-full bg-current"
                style={{ width: TICK_FULL }}
              />
            ))}
          </span>
        </MotionButton>
      </Tooltip>
    </div>
  )
}
