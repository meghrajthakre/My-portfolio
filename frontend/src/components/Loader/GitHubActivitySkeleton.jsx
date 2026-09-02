const SkeletonBlock = ({ className = "" }) => (
  <span className={`block animate-pulse rounded bg-[var(--color-icons-bg)] ${className}`} />
);

const GitHubActivitySkeleton = ({ section = false }) => (
  <section className={section ? "py-4" : ""} aria-label="Loading GitHub activity" aria-busy="true">
    {section && (
      <div className="mb-5 space-y-2">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-7 w-44" />
      </div>
    )}

    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:p-7">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
        <SkeletonBlock className="h-8 w-24 rounded-full" />
      </div>

      <div className="min-w-[620px] space-y-2 overflow-hidden">
        {Array.from({ length: 7 }, (_, row) => (
          <div key={row} className="flex gap-1.5">
            {Array.from({ length: 32 }, (_, column) => (
              <SkeletonBlock
                key={column}
                className={`size-[11px] shrink-0 ${((row * 7 + column * 3) % 5 === 0) ? "opacity-55" : "opacity-90"}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <SkeletonBlock className="h-3 w-52" />
        <div className="flex gap-1"><SkeletonBlock className="size-3" /><SkeletonBlock className="size-3" /><SkeletonBlock className="size-3" /><SkeletonBlock className="size-3" /></div>
      </div>
    </div>
  </section>
);

export default GitHubActivitySkeleton;
