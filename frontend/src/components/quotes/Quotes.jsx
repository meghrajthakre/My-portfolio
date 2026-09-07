import { useState } from "react";
import { quotesData } from "../../data/quotesData";
import QuoteCard from "./QuoteCard";

const getRandomQuote = () => quotesData[Math.floor(Math.random() * quotesData.length)];

const Quotes = () => {
  const [randomQuote] = useState(getRandomQuote);

  if (!randomQuote) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-3xl px-8 sm:mt-16 md:mt-20" aria-label="Quote">
      <QuoteCard quote={randomQuote.quote} author={randomQuote.author} />
    </section>
  );
};

export default Quotes;
