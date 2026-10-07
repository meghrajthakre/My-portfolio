const SkeletonBlock = ({ className = "" }) => (
  <span className={`block motion-safe:animate-pulse rounded bg-[var(--color-icons-bg)] ${className}`} />
);

const LoadingFallback = ({ section = false }) => (
  <section
    className={section ? "mx-auto mt-8 max-w-3xl px-8 py-4" : "mx-auto min-h-[40vh] max-w-3xl px-8 py-10"}
    role="status"
    aria-label={section ? "Loading featured content" : "Loading page content"}
    aria-live="polite"
    aria-busy="true"
  >
    <div className="mb-6 space-y-2" aria-hidden="true">
      <SkeletonBlock className="h-3 w-20" />
      <SkeletonBlock className="h-7 w-44" />
      {!section && <SkeletonBlock className="h-4 w-64 max-w-full" />}
    </div>
    <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
      {["first", "second"].map((card) => (
        <div key={card} className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4">
          <SkeletonBlock className="mb-4 aspect-video w-full" />
          <SkeletonBlock className="mb-2 h-5 w-3/4" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="mt-2 h-3 w-2/3" />
        </div>
      ))}
    </div>
  </section>
);

export default LoadingFallback;
