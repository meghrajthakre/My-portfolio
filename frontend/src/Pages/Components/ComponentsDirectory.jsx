import { COMPONENTS } from "./Sidebar/Registry";

// One easing + duration for the border, the text wipe and the indicator, so they move as one.
const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

// A component counts as "new" for 2 months after its `createdAt` date
// (ISO string, e.g. "2026-10-15"). Entries without a valid date are not new.
const NEW_FOR_MONTHS = 2;

function isNewItem(item, cutoff) {
  if (!item.createdAt) return false;
  const created = new Date(item.createdAt);
  return !Number.isNaN(created.getTime()) && created >= cutoff;
}

// "Scan target" indicator: a quiet dot that locks on to the accent colour on
// hover, with a ring that pings outward. New components keep a blue dot.
function ScanDot({ isNew }) {
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center" aria-hidden="true">
      <span
        className={`absolute inline-flex h-full w-full rounded-full opacity-0 group-hover:animate-ping group-hover:opacity-60 group-focus-visible:animate-ping group-focus-visible:opacity-60 motion-reduce:animate-none ${
          isNew ? "bg-blue-500" : "bg-[var(--color-accent)]"
        }`}
      />
      <span
        className={`absolute h-4 w-4 scale-50 rounded-full border opacity-0 transition-all duration-500 ${EASE} group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none ${
          isNew ? "border-blue-500" : "border-[var(--color-accent)]"
        }`}
      />
      <span
        className={`relative inline-flex h-1.5 w-1.5 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
          isNew
            ? "bg-blue-500"
            : "bg-[var(--color-muted)] group-hover:bg-[var(--color-accent)] group-focus-visible:bg-[var(--color-accent)]"
        }`}
      />
    </span>
  );
}

function ComponentsDirectory({ onItemClick }) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - NEW_FOR_MONTHS);

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-3xl px-6 py-8 sm:px-8 lg:py-12">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Components
          </h1>
          <p className="mt-2 text-sm text-[var(--color-secondary-text)]">
            Interactive demos. Pick one to open.
          </p>
        </div>
        <span className="pb-1 text-sm tabular-nums text-[var(--color-muted)]">
          {COMPONENTS.length}
        </span>
      </header>

      <nav
        aria-label="Component directory"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {COMPONENTS.map((item) => {
          const isNew = isNewItem(item, cutoff);
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => onItemClick(item, event)}
              className={`group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--color-border)] px-5 py-4 outline-none transition-colors duration-500 ${EASE} hover:border-[var(--color-text)] focus-visible:border-[var(--color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] motion-reduce:transition-none`}
            >
              {/* The text colour wipes in step with the border. */}
              <span
                className={`bg-[linear-gradient(90deg,var(--color-text),var(--color-text)),linear-gradient(90deg,var(--color-secondary-text),var(--color-secondary-text))] bg-[length:0%_100%,100%_100%] bg-no-repeat bg-clip-text text-transparent transition-[background-size] duration-500 ${EASE} group-hover:bg-[length:100%_100%,100%_100%] group-focus-visible:bg-[length:100%_100%,100%_100%] motion-reduce:transition-none`}
              >
                {item.title}
              </span>
              {isNew && <span className="sr-only">New</span>}
              <ScanDot isNew={isNew} />
            </a>
          );
        })}
      </nav>
    </main>
  );
}

export default ComponentsDirectory;