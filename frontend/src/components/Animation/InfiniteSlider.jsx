import { developmentSkills, workflowSkills } from "./infinite-slider/skills";
import SkillMarquee from "./infinite-slider/SkillMarquee";
import SkillRow from "./infinite-slider/SkillRow";
import { StaggerItem, StaggerReveal } from "./StaggerReveal";

const InfiniteSlider = () => (
  <section className="py-12 sm:py-16" aria-label="Skills">
    <StaggerReveal className="flex flex-col gap-3" delay={0.06} staggerAmount={0.14}>
      <StaggerItem>
        <SkillRow title="Development" labelPosition="right">
          <SkillMarquee skills={developmentSkills} direction="left" label="Development skills" baseSpeed={36} />
        </SkillRow>
      </StaggerItem>
      <StaggerItem>
        <SkillRow title="Workflow" labelPosition="left">
          <SkillMarquee skills={workflowSkills} direction="right" label="Workflow skills" baseSpeed={30} />
        </SkillRow>
      </StaggerItem>
    </StaggerReveal>
  </section>
);

export default InfiniteSlider;
