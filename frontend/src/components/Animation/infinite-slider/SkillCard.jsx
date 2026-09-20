/**
 * Ticker item instead of a boxed card: coloured mark, name, hairline separator.
 * No border, no background, no hover.
 */
const SkillCard = ({ skill, hidden = false }) => {
  const { Icon, name, color } = skill;

  return (
    <div
      role={hidden ? undefined : "listitem"}
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-2.5 border-r border-[color:color-mix(in_srgb,var(--color-border)_55%,transparent)] px-6 last:border-r-0"
    >
      <Icon aria-hidden="true" className="text-[1.15rem]" style={{ color }} />
      <span className="whitespace-nowrap text-[.9rem] font-medium text-[var(--color-text)]">
        {name}
      </span>
    </div>
  );
};

export default SkillCard;