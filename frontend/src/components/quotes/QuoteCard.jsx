const QuoteCard = ({ quote, author }) => (
  <figure className="relative m-0 min-h-[126px] px-6 py-7">
    <img
      src="/quotes/open-quote.svg"
      alt=""
      className="pointer-events-none absolute left-5 top-3 h-[100px] w-[140px] select-none opacity-10 dark:opacity-40"
      aria-hidden="true"
    />

    <blockquote className="relative z-10 m-0">
      <p className="m-0 font-mono text-[15px] font-semibold italic leading-relaxed text-[var(--color-secondary-text)] sm:text-[18px]">
        &quot;{quote}&quot;
      </p>
    </blockquote>

    <figcaption className="relative z-10 mt-1 text-right font-mono text-sm italic text-[var(--color-secondary-text)] sm:text-base">
      — <cite className="not-italic">{author}</cite>
    </figcaption>
  </figure>
);

export default QuoteCard;