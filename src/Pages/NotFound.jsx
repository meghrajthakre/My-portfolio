import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="mx-auto max-w-3xl min-h-[60vh] px-8 py-20 text-center">
    <p className="text-sm text-[var(--color-secondary-text)]">404</p>
    <h1 className="mt-2 text-4xl">Page not found</h1>
    <p className="mt-4 text-[var(--color-secondary-text)]">The page you are looking for does not exist.</p>
    <Link className="mt-6 inline-block underline underline-offset-4" to="/">Back to home</Link>
  </main>
);

export default NotFound;
