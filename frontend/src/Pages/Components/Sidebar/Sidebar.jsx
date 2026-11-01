import { useCallback, useId, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { LineNav } from "../../../components/line-nav"
import { cn } from "../../../lib/utils"
import { ScrollFade } from "./ScrollFade"
import { ToggleButton } from "./ToggleButton"

const MotionDiv = motion.div
const MOBILE_QUERY = "(max-width: 1023px)"
const PANEL_SPRING = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 }

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
      <ToggleButton open={open} onClick={toggle} listId={listId} />

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
