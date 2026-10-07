import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion, useReducedMotion } from "motion/react";
import ShinyText from "../../Animation/ShinyText";

const CHANGE_INTERVAL = 3600;

const RotatingRole = ({ roles }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % roles.length);
    }, CHANGE_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [reduceMotion, roles.length]);

  return (
    <span className="relative inline-flex h-[1.5em] w-[160px] items-center overflow-hidden sm:w-[240px]" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <Motion.span
          key={roles[activeIndex]}
          className="absolute left-0 inline-flex w-full whitespace-nowrap"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <ShinyText
            text={roles[activeIndex]}
            speed={4}
            delay={3}
            color="var(--color-secondary-text)"
            shineColor="var(--color-text)"
            spread={320}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={reduceMotion}
            className="w-full"
          />
        </Motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingRole;
