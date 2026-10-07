import { motion, useReducedMotion } from "framer-motion";

const ScrollReveal = ({ children, delay = 0, className = "", once = true }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={reduceMotion ? undefined : { willChange: "transform, opacity" }}
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.12, margin: "0px 0px -80px 0px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
