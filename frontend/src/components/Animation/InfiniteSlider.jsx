import { developmentSkills, workflowSkills } from "./infinite-slider/skills";
import SkillMarquee from "./infinite-slider/SkillMarquee";
import SkillRow from "./infinite-slider/SkillRow";

const InfiniteSlider = () => (
  <section className="py-12 sm:py-16" aria-label="Skills">
    <div className="flex flex-col gap-3">
      <SkillRow title="Development" labelPosition="right">
        <SkillMarquee skills={developmentSkills} direction="left" label="Development skills" baseSpeed={36} />
      </SkillRow>
      <SkillRow title="Workflow" labelPosition="left">
        <SkillMarquee skills={workflowSkills} direction="right" label="Workflow skills" baseSpeed={30} />
      </SkillRow>
    </div>
  </section>
);

export default InfiniteSlider;
