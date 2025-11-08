import React, { useEffect, useState } from "react";
import { quotesData } from "../data/quotesData";

const Quotes = () => {
  const [randomQuote, setRandomQuote] = useState(null);

  const generateQuote = () => {
    const randomNum = Math.floor(Math.random() * quotesData.length);
    const selectedQuote = quotesData[randomNum];
    setRandomQuote(selectedQuote);
  };

  useEffect(() => {
    generateQuote();
  }, []);

  if (!randomQuote) return null; // ✅ Prevents "undefined" error before data loads

  return (
    <div className="font-bold px-6 sm:p-6 md:p-8 py-6 sm:py-8  text-[var(--color-secondary-text)] rounded-md mt-10 sm:mt-16 md:mt-20 sm:mx-8 md:mx-auto max-w-md sm:max-w-lg md:max-w-3xl text-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
      <p className="text-base sm:text-lg md:text-xl italic mb-3 leading-relaxed">
        “{randomQuote.quote}”
      </p>
      <h3 className="text-sm sm:text-base md:text-lg text-[var(--color-icons-bg)] mt-2">
        — {randomQuote.author}
      </h3>
    </div>
  );
};

export default Quotes;
