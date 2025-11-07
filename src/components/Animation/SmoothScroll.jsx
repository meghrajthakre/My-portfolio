import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // scroll speed
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easing curve
      smooth: true,
    });

    // animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // cleanup
    return () => lenis.destroy();
  }, []);

  return null;
};

export default SmoothScroll;
