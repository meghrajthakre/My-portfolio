import SkillCard from "./SkillCard";
import { StaggerItem, StaggerReveal } from "../StaggerReveal";

/**
 * CSS-only seamless ticker. No JS, no observers.
 * Needs the two keyframes shown in marquee-keyframes.css.
 *
 * Speed is derived from the number of items so both rows move at the
 * same visual pace, no matter how many skills are in each.
 */
const SkillMarquee = ({ skills, direction = "left", label, secondsPerItem = 3.2 }) => {
  const duration = `${skills.length * secondsPerItem}s`;
  const animation = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="relative overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]">
      <div
        role="list"
        aria-label={label}
        className="flex w-max motion-reduce:animate-none"
        style={{ animation: `${animation} ${duration} linear infinite` }}
      >
        <StaggerReveal className="flex" delay={0} staggerAmount={0.04} viewport={{ once: true, amount: 0, margin: "0px" }}>
          {skills.map((skill) => (
            <StaggerItem key={skill.name} duration={0.28}>
              <SkillCard skill={skill} />
            </StaggerItem>
          ))}
        </StaggerReveal>
        <div className="flex" aria-hidden="true">
          {skills.map((skill) => (
            <SkillCard key={`${skill.name}-duplicate`} skill={skill} hidden />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillMarquee;
