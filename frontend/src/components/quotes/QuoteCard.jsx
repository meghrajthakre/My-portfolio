const QuoteCard = ({ quote, author }) => (
  <figure className="relative m-0 min-h-[156px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-card-bg)_55%,transparent)] px-6 py-8 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-text)_5%,transparent)] sm:px-10 sm:py-9">
    <span
      className="pointer-events-none absolute left-5 top-4 select-none font-serif text-[116px] font-black leading-none text-[var(--color-secondary-text)] opacity-20 sm:left-7"
      aria-hidden="true"
    >
      “
    </span>

    <blockquote className="relative z-10 m-0 flex min-h-[84px] flex-col justify-center">
      <p className="m-0 text-base font-semibold italic leading-relaxed text-[var(--color-secondary-text)] sm:text-lg">
        “{quote}”
      </p>
      <footer className="mt-2 self-end text-sm italic text-[var(--color-secondary-text)] sm:text-base">
        — {author}
      </footer>
    </blockquote>
  </figure>
);

export default QuoteCard;
