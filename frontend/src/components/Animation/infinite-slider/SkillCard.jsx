const SkillCard = ({ skill, hidden = false }) => {
  const { Icon, name, color } = skill;

  return (
    <div role={hidden ? undefined : "listitem"} aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-3 rounded-full border border-dashed border-[color:color-mix(in_srgb,var(--color-border)_80%,transparent)] bg-[color:color-mix(in_srgb,var(--color-card-bg)_90%,transparent)] py-2 pr-5 pl-2">
      <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[color:color-mix(in_srgb,currentColor_14%,transparent)] text-[1.2rem]" style={{ color }}>
        <Icon />
      </span>
      <span className="whitespace-nowrap text-[.85rem] font-semibold tracking-tight text-[var(--color-text)]">{name}</span>
    </div>
  );
};

export default SkillCard;
