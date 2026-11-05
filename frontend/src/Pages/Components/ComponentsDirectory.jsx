import { COMPONENTS } from "./Sidebar/Registry";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 text-[var(--color-muted)] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:text-white group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:text-white group-focus-visible:opacity-100 motion-reduce:transition-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10" />
      <path d="M9 4l4 4-4 4" />
    </svg>
  );
}

function ComponentsDirectory({ onItemClick }) {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-3xl px-2 py-10 sm:px-8 lg:py-14">
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
        className="grid gap-x-8 sm:grid-cols-2"
      >
        {COMPONENTS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={(event) => onItemClick(item, event)}
            className="group relative flex items-center justify-between gap-3 py-3.5 outline-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
              before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-[linear-gradient(90deg,var(--color-border)_50%,transparent_0)] before:bg-[length:6px_1px] before:bg-repeat-x
              after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[linear-gradient(90deg,#fff_50%,transparent_0)] after:bg-[length:6px_1px] after:bg-repeat-x after:transition-transform after:duration-500 after:ease-out
              hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none"
          >
            {/* text colour wipes from muted to white, in sync with the line */}
            <span
              className="bg-[linear-gradient(90deg,#fff,#fff),linear-gradient(90deg,var(--color-secondary-text),var(--color-secondary-text))] bg-[length:0%_100%,100%_100%] bg-no-repeat bg-clip-text text-transparent transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_100%,100%_100%] group-focus-visible:bg-[length:100%_100%,100%_100%] motion-reduce:transition-none"
            >
              {item.title}
            </span>
            <ArrowIcon />
          </a>
        ))}
      </nav>
    </main>
  );
}

export default ComponentsDirectory;