import { StaggerItem, StaggerReveal } from "../StaggerReveal";

const SkillLabel = ({ title, position }) => {
  const pointsRight = position === "left";

  return (
    <StaggerReveal className={`w-38 ${pointsRight ? "-translate-x-2" : "translate-x-"}`} delay={0.08}>
      <StaggerItem>
        <p className={`w-full text-center text-xl font-semibold leading-none text-[var(--color-secondary-text)] ${pointsRight ? "-rotate-35" : "rotate-20"}`} style={{ fontFamily: "'Caveat', cursive" }}>
          {title}
        </p>
      </StaggerItem>
      <StaggerItem>
        <svg aria-hidden="true" viewBox="0 0 90 44" className={`-mt-4 h-15 w-18 text-[var(--color-secondary-text)] ${pointsRight ? "translate-x-20" : "translate-x- -scale-x-100"}`}>
          <path d="M10 4c-2 14 3 24 15 28 10 3 22 1 32-4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="m48 24 10 3-4 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </StaggerItem>
    </StaggerReveal>
  );
};

export default SkillLabel;
