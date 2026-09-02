const BottomBlur = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto h-14 max-w-3xl backdrop-blur-[5px]"
    style={{
      WebkitMaskImage:
        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.12) 35%, black 100%), linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      WebkitMaskComposite: "source-in",
      maskImage:
        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.12) 35%, black 100%), linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      maskComposite: "intersect",
      background:
        "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-text) 6%, transparent))",
    }}
  />
);

export default BottomBlur;