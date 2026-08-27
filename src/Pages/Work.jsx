import { Link } from "react-router-dom";

const Work = () => (
  <main className="mx-auto max-w-3xl min-h-[60vh] px-8 py-14">
    <p className="text-sm text-[var(--color-secondary-text)]">Work</p>
    <h1 className="mt-2 text-4xl">Building useful digital experiences.</h1>
    <p className="mt-5 max-w-xl text-[var(--color-secondary-text)]">
      I work across frontend and backend development, with a focus on clear interfaces, maintainable React code, APIs, and thoughtful motion.
    </p>
    <Link className="mt-6 inline-block underline underline-offset-4" to="/projects">Explore my projects</Link>
  </main>
);

export default Work;
