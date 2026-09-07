import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import FooterAnalytics from "../components/footer/FooterAnalytics";
import { getGithubBuildNumber } from "../services/githubService";

const SOURCE_URL = "https://github.com/meghrajthakre/My-portfolio";
const linkStyles = "text-[var(--color-secondary-text)] transition-colors hover:text-[var(--color-text)]";

const Footer = () => {
  const [build, setBuild] = useState(null);

  useEffect(() => {
    let active = true;
    getGithubBuildNumber("meghrajthakre", "My-portfolio")
      .then((data) => active && setBuild(data))
      .catch(() => active && setBuild(null));
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="mx-auto mt-20 w-full max-w-3xl px-8 pb-14 font-[var(--font-main)] max-sm:mt-14">
      <div className="grid grid-cols-1 items-center gap-4 border-t border-[var(--color-border)] pt-6 text-center text-sm sm:grid-cols-[1fr_auto_1fr] sm:text-left">
        <span className="text-[var(--color-secondary-text)]">
          © 2026 Meghraj Thakre
          <a className={`${linkStyles} ml-2 underline underline-offset-4`} href={`${SOURCE_URL}/commits`} target="_blank" rel="noreferrer">
            build {build?.buildNumber ?? "—"}
          </a>
        </span>

        <FooterAnalytics />

        <nav className="flex items-center justify-center gap-4 text-base sm:justify-end" aria-label="Social links">
          <a className={linkStyles} href="https://x.com/meghraj_thakre1" target="_blank" rel="noreferrer" aria-label="X profile">
            <FaXTwitter />
          </a>
          <a className={linkStyles} href={SOURCE_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository">
            <FaGithub />
          </a>
          <a className={linkStyles} href="https://www.linkedin.com/in/meghraj-thakre-01a09b23a/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
            <FaLinkedin />
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
