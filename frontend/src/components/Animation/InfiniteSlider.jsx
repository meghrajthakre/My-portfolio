import React, { useEffect, useRef } from "react";
import { FaCss3Alt, FaHtml5, FaJs, FaNodeJs, FaReact } from "react-icons/fa";
import { StaggerItem, StaggerReveal } from "./StaggerReveal";
import {
  SiAdobephotoshop,
  SiCanva,
  SiExpress,
  SiMongodb,
  SiMongoose,
  SiPostman,
  SiPython,
  SiTailwindcss,
  SiVscodium,
} from "react-icons/si";

const developmentSkills = [
  { Icon: FaHtml5, name: "HTML", color: "#E44D26" },
  { Icon: FaCss3Alt, name: "CSS", color: "#1572B6" },
  { Icon: FaJs, name: "JavaScript", color: "#F7DF1E" },
  { Icon: FaReact, name: "React", color: "#61DAFB" },
  { Icon: FaNodeJs, name: "Node.js", color: "#5FA04E" },
  { Icon: SiExpress, name: "Express", color: "var(--color-text)" },
  { Icon: SiTailwindcss, name: "Tailwind CSS", color: "#38BDF8" },
  { Icon: SiMongodb, name: "MongoDB", color: "#47A248" },
  { Icon: SiMongoose, name: "Mongoose", color: "#B31B1B" },
];

const workflowSkills = [
  { Icon: SiPython, name: "Python", color: "#3776AB" },
  { Icon: SiPostman, name: "Postman", color: "#FF6C37" },
  { Icon: SiVscodium, name: "VS Code", color: "#2F80ED" },
  { Icon: SiCanva, name: "Canva", color: "#00C4CC" },
  { Icon: SiAdobephotoshop, name: "Photoshop", color: "#31A8FF" },
];

const SkillCard = ({ skill, hidden = false }) => {
  const { Icon, name, color } = skill;

  return (
    <div
      role={hidden ? undefined : "listitem"}
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-3 rounded-full border border-dashed border-[color:color-mix(in_srgb,var(--color-border)_80%,transparent)] bg-[color:color-mix(in_srgb,var(--color-card-bg)_90%,transparent)] py-2 pr-5 pl-2"
    >
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-full bg-[color:color-mix(in_srgb,currentColor_14%,transparent)] text-[1.2rem]"
        style={{ color }}
      >
        <Icon />
      </span>
      <span className="whitespace-nowrap text-[.85rem] font-semibold tracking-tight text-[var(--color-text)]">
        {name}
      </span>
    </div>
  );
};

/* Scroll-velocity driven marquee.
   Scroll down speeds it up, scroll up slows and briefly reverses it. */
const SkillMarquee = ({ skills, direction = "left", label, baseSpeed = 38 }) => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // CSS fallback: row becomes horizontally scrollable

    const dir = direction === "left" ? -1 : 1;
    let offset = 0;
    let loopWidth = 0;
    let scrollVel = 0; // smoothed, px/s
    let lastY = window.scrollY;
    let lastT = performance.now();
    let visible = true;
    let raf;

    const measure = () => {
      loopWidth = track.scrollWidth / 2;
      if (dir === 1) offset = -loopWidth;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastT = performance.now();
    });
    io.observe(viewport);

    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      if (dt <= 0) return;

      const y = window.scrollY;
      const instant = (y - lastY) / dt;
      lastY = y;
      scrollVel += (instant - scrollVel) * Math.min(dt * 6, 1);

      const boost = Math.max(-240, Math.min(scrollVel * 0.25, 700));
      const speed = dir * (baseSpeed + boost);

      offset += speed * dt;
      if (loopWidth) {
        if (offset <= -loopWidth) offset += loopWidth;
        if (offset > 0) offset -= loopWidth;
      }

      track.style.transform = `translate3d(${offset}px,0,0)`;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [direction, baseSpeed]);

  return (
    <div
      ref={viewportRef}
      className="overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:overflow-x-auto"
    >
      <div
        ref={trackRef}
        role="list"
        aria-label={label}
        className="flex w-max gap-3 will-change-transform"
      >
        {skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
        {skills.map((skill) => (
          <SkillCard key={`${skill.name}-dup`} skill={skill} hidden />
        ))}
      </div>
    </div>
  );
};

const SkillLabel = ({ title, direction }) => {
  const pointsRight = direction === "left";

  return (
    <StaggerReveal className="w-32 max-sm:mb-1" delay={0.08}>
      <StaggerItem>
        <p
          className={`w-32 text-center text-lg font-semibold leading-none text-[var(--color-secondary-text)] ${pointsRight ? "-rotate-12" : "rotate-12"}`}
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          {title}
        </p>
      </StaggerItem>
      <StaggerItem>
        <svg
          aria-hidden="true"
          viewBox="0 0 90 44"
          className={`-mt-5 h-15 w-20 text-[var(--color-secondary-text)] ${pointsRight ? "translate-x-10" : "translate-x-2 -scale-x-100"}`}
        >
          <path d="M10 4c-2 14 3 24 15 28 10 3 22 1 32-4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="m48 24 10 3-4 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </StaggerItem>
    </StaggerReveal>
  );
};

const Row = ({ title, titlePosition = "left", children }) => (
  <div className="relative">
    <div className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 lg:block ${titlePosition === "right" ? "left-[calc(100%+3rem)]" : "right-[calc(100%+3rem)]"}`}>
      <SkillLabel title={title} direction={titlePosition} />
    </div>
    {children}
  </div>
);

const InfiniteSlider = () => (
  <section className="py-12 sm:py-16" aria-label="Skills">
    <div className="relative">
    <div className="flex flex-col gap-3">
      <Row title="Development" titlePosition="right">
        <SkillMarquee skills={developmentSkills} direction="left" label="Development skills" baseSpeed={36} />
      </Row>
      <Row title="Workflow">
        <SkillMarquee skills={workflowSkills} direction="right" label="Workflow skills" baseSpeed={30} />
      </Row>
    </div>
    </div>
  </section>
);

export default InfiniteSlider;
