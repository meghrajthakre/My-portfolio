import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    y: 8,
    filter: "blur(6px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1], // custom "easeOutExpo"-ish curve — smooth deceleration
      filter: { duration: 0.35 },
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1], // quick ease-in on exit, feels snappier than a linear fade
    },
  },
};

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const RouteTransition = ({ children, routeKey }) => {
  const shouldReduceMotion = useReducedMotion();
  const activeVariants = shouldReduceMotion ? reducedVariants : variants;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={routeKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={activeVariants}
        style={{ willChange: "opacity, transform, filter" }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
};

export default RouteTransition;