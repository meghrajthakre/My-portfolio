import SkillLabel from "./SkillLabel";

const SkillRow = ({ title, labelPosition = "left", children }) => (
  <div className="relative">
    <div className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 lg:block ${labelPosition === "right" ? "left-[calc(100%+3rem)]" : "right-[calc(100%+3rem)]"}`}>
      <SkillLabel title={title} position={labelPosition} />
    </div>
    {children}
  </div>
);

export default SkillRow;
