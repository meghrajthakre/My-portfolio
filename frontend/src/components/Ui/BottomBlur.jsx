const BottomBlur = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed -bottom-px left-0 right-0 z-30 mx-auto h-16 max-w-3xl backdrop-blur-[10px] sm:h-14"
    style={{
      WebkitMaskImage:
        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.2) 52%, black 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      WebkitMaskComposite: "source-in",
      maskImage:
        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.2) 52%, black 100%), linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      maskComposite: "intersect",
      background:
        "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-text) 6%, transparent))",
    }}
  />
);

export default BottomBlur;
