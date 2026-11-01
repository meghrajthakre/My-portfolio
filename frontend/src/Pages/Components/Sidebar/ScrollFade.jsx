import { useCallback, useEffect, useRef } from "react"

import { cn } from "../../../lib/utils"

const FADE_TOP = 40
const FADE_BOTTOM = 28
const SCROLL_EPSILON = 2
const MASK =
  "linear-gradient(to bottom, transparent 0, #000 var(--fade-top, 0px), #000 calc(100% - var(--fade-bottom, 0px)), transparent 100%)"
const MASK_STYLE = { maskImage: MASK, WebkitMaskImage: MASK }

export function ScrollFade({ id, className, children }) {
  const ref = useRef(null)
  const frame = useRef(0)
  const last = useRef({ top: -1, bottom: -1 })

  const apply = useCallback(() => {
    frame.current = 0
    const element = ref.current
    if (!element) return

    const remaining =
      element.scrollHeight - element.clientHeight - element.scrollTop
    const top = element.scrollTop > SCROLL_EPSILON ? FADE_TOP : 0
    const bottom = remaining > SCROLL_EPSILON ? FADE_BOTTOM : 0

    if (top !== last.current.top) {
      element.style.setProperty("--fade-top", `${top}px`)
      last.current.top = top
    }
    if (bottom !== last.current.bottom) {
      element.style.setProperty("--fade-bottom", `${bottom}px`)
      last.current.bottom = bottom
    }
  }, [])

  const schedule = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(apply)
  }, [apply])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    apply()
    const observer = new ResizeObserver(schedule)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)

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
