import React from "react";
import { motion } from "framer-motion";

const Transition = (OgComponent) => {
  return function WrappedComponent(props) {
    return (
      <motion.div
        initial={{ opacity: 0, filter: "blur(3px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 1, filter: "blur(3px)" }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen max-w-3xl mx-auto px-6"
      >
        <OgComponent {...props} />
      </motion.div>
    );
  };
};

export default Transition;
