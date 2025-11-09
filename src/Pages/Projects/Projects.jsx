import React from "react";
import Transition from "../../transition/Transition";
import Cards from "../../components/Ui/Layouts/Cards";

const Projects = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 sm:px-8 mt-12 mb-16">
      {/* Header */}
      <header className="text-center pb-6 border-b border-[var(--color-border)] flex flex-col items-center gap-4">
        <h2 className="text-4xl font-bold text-[var(--color-heading)]">
          Projects
        </h2>
        <p className="text-[var(--color-text)] max-w-md">
          A showcase of my projects across different technologies and domains.
        </p>
      </header>

      {/* Cards Section */}
      <div className="mt-10">
        <Cards num={6} />
      </div>
    </section>
  );
};

export default Transition(Projects);
