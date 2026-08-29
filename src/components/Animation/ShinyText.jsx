import { useCallback, useEffect, useRef, useState } from "react";
import { motion as Motion, useAnimationFrame, useMotionValue, useTransform } from "motion/react";
import "./ShinyText.css";

const ShinyText = ({
  text,
  disabled = false,
  speed = 2,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
  delay = 0,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const directionRef = useRef(direction === "left" ? 1 : -1);

  const animationDuration = Math.max(speed * 1000, 1);
  const delayDuration = Math.max(delay * 1000, 0);

  useAnimationFrame((time) => {
    if (disabled || isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    const cycleDuration = animationDuration + delayDuration;

    if (yoyo) {
      const fullCycle = cycleDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        const value = (cycleTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? value : 100 - value);
      } else if (cycleTime < cycleDuration) {
        progress.set(directionRef.current === 1 ? 100 : 0);
      } else if (cycleTime < cycleDuration + animationDuration) {
        const reverseTime = cycleTime - cycleDuration;
        const value = 100 - (reverseTime / animationDuration) * 100;
        progress.set(directionRef.current === 1 ? value : 100 - value);
      } else {
        progress.set(directionRef.current === 1 ? 0 : 100);
      }
      return;
    }

    const cycleTime = elapsedRef.current % cycleDuration;
    if (cycleTime < animationDuration) {
      const value = (cycleTime / animationDuration) * 100;
      progress.set(directionRef.current === 1 ? value : 100 - value);
    } else {
      progress.set(directionRef.current === 1 ? 100 : 0);
    }
  });

  useEffect(() => {
    directionRef.current = direction === "left" ? 1 : -1;
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    progress.set(directionRef.current === 1 ? 0 : 100);
  }, [direction, progress]);

  const backgroundPosition = useTransform(progress, (value) => `${150 - value * 2}% center`);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const shineStyle = {
    backgroundImage: `linear-gradient(${spread}deg, transparent 40%, ${shineColor} 50%, transparent 60%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <span
      className={`motion-shiny-text ${className}`}
      style={{ color }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span>{text}</span>
      {!disabled && (
        <Motion.span
          aria-hidden="true"
          className="motion-shiny-text__shine"
          style={{ ...shineStyle, backgroundPosition }}
        >
          {text}
        </Motion.span>
      )}
    </span>
  );
};

export default ShinyText;
