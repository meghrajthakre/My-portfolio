import HumanBackground from "../components/human-background/HumanBackground";

const HUMAN_SCAN_SETTINGS = {
  radius: 0.035,
  strength: 0.15,
  // skeleton ko body se milane ke dials, zarurat ho tab badlo
  innerScale: 1,
  innerX: 0,
  innerY: 0,
};

const HumanScan = () => (
  <>
    <HumanBackground
      innerUrl="/models/skeleton.glb"
      settings={HUMAN_SCAN_SETTINGS}
    />
    <main className="relative z-0 mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center text-[var(--color-text)]">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
        Interactive 3D study
      </p>
      <h1 className="text-4xl font-bold sm:text-6xl">Human Scan</h1>
      <p className="mt-5 max-w-lg text-base text-[var(--color-secondary-text)] sm:text-lg">
        Move your pointer across the scan to reveal its inner structure.
      </p>
    </main>
  </>
);

export default HumanScan;