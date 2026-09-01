import { motion, useReducedMotion } from "framer-motion";

const StaggerReveal = ({ children, className = "", delay = 0, staggerAmount = 0.09 }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reduceMotion ? 0 : delay,
            staggerChildren: reduceMotion ? 0 : staggerAmount,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = "" }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{ willChange: "transform, opacity" }}
      variants={{
        hidden: reduceMotion ? {} : { opacity: 0, y: 14, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: reduceMotion ? 0 : 0.55,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export { StaggerItem, StaggerReveal };