import { useEffect, useRef } from "react";
import SkillCard from "./SkillCard";

const SkillMarquee = ({ skills, direction = "left", label, baseSpeed = 38 }) => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const directionMultiplier = direction === "left" ? -1 : 1;
    let offset = 0;
    let loopWidth = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let isVisible = true;
    let animationFrame;

    const measure = () => {
      loopWidth = track.scrollWidth / 2;
      if (directionMultiplier === 1) offset = -loopWidth;
    };
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      lastTime = performance.now();
    });
    intersectionObserver.observe(viewport);

    const tick = (time) => {
      animationFrame = requestAnimationFrame(tick);
      if (!isVisible) return;

      const elapsed = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (elapsed <= 0) return;

      const currentScrollY = window.scrollY;
      const instantVelocity = (currentScrollY - lastScrollY) / elapsed;
      lastScrollY = currentScrollY;
      scrollVelocity += (instantVelocity - scrollVelocity) * Math.min(elapsed * 6, 1);
      const scrollBoost = Math.max(-240, Math.min(scrollVelocity * 0.25, 700));
      offset += directionMultiplier * (baseSpeed + scrollBoost) * elapsed;

      if (loopWidth) {
        if (offset <= -loopWidth) offset += loopWidth;
        if (offset > 0) offset -= loopWidth;
      }
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };
    animationFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [direction, baseSpeed]);

  return (
    <div ref={viewportRef} className="overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:overflow-x-auto">
      <div ref={trackRef} role="list" aria-label={label} className="flex w-max gap-3 will-change-transform">
        {skills.map((skill) => <SkillCard key={skill.name} skill={skill} />)}
        {skills.map((skill) => <SkillCard key={`${skill.name}-duplicate`} skill={skill} hidden />)}
      </div>
    </div>
  );
};

export default SkillMarquee;
