import React from "react";
import Cards from "../../components/Ui/Layouts/Cards";

const Projects = () => {
  return (
    <section className="max-w-3xl mx-auto px-8 sm:px-8 mt-8 mb-16">
      {/* Header */}
      <header className="text-center pb-6 border-b border-[var(--color-border)] flex flex-col items-center gap-6">
        <h4 className="text-4xl font-bold text-[var(--color-heading)]">
          Projects
        </h4>
        <span className="text-[var(--color-text)] max-w-md">
          A showcase of my projects across different technologies and domains.
        </span>
      </header>

      {/* Cards Section */}
      <div className="mt-10">
        <Cards num={6} />
      </div>
    </section>
  );
};

export default Projects;

