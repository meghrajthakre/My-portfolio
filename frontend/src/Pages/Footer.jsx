import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import BrandLogo from "../components/layout/Navbar/BrandLogo";
import { getVisitSummary } from "../services/analyticsService";
import { getGithubBuildNumber } from "../services/githubService";

const SOURCE_URL = "https://github.com/meghrajthakre/My-portfolio";
const linkStyles = "text-[var(--color-text)] underline decoration-[var(--color-secondary-text)] underline-offset-4 transition-colors hover:text-[var(--logo-bg)]";

const FooterCell = ({ label, children, className = "" }) => (
  <div className={`footer-cell ${className}`}>
    <span className="footer-label">{label}</span>
    <div className="footer-value">{children}</div>
  </div>
);

const Footer = () => {
  const [visitorStats, setVisitorStats] = useState(null);
  const [buildNumber, setBuildNumber] = useState(null);

  useEffect(() => {
    let active = true;
    getVisitSummary().then((data) => active && setVisitorStats(data)).catch(() => active && setVisitorStats(null));
    getGithubBuildNumber("meghrajthakre", "My-portfolio").then((data) => active && setBuildNumber(data.buildNumber)).catch(() => active && setBuildNumber(null));
    return () => { active = false; };
  }, []);

  const analytics = visitorStats
    ? [`${visitorStats.totalVisits.toLocaleString("en-IN")} visits`, `${visitorStats.uniqueVisitors.toLocaleString("en-IN")} unique`, `${visitorStats.onlineVisitors ?? 0} online`]
    : ["First-party analytics", "Loading insights…"];

  return (
    <footer className="footer-shell">
      <div className="footer-frame">
        <div className="footer-heading">
          <a href="https://thakre.services" target="_blank" rel="noreferrer" className="footer-domain">thakre.services</a>
          <p>A full-stack dev portfolio, built with code and curiosity.</p>
        </div>

        <div className="footer-grid footer-grid-four">
          <FooterCell label="Crafted by"><a className={linkStyles} href="https://github.com/meghrajthakre" target="_blank" rel="noreferrer">@meghrajthakre</a></FooterCell>
          <FooterCell label="Build"><a className={linkStyles} href={`${SOURCE_URL}/commits`} target="_blank" rel="noreferrer">dc{buildNumber ?? "—"}</a></FooterCell>
          <FooterCell label="Date">2026-09-06</FooterCell>
          <FooterCell label="Registry">portfolio v1.0</FooterCell>
        </div>

        <div className="footer-grid footer-grid-four">
          <FooterCell label="Deployed on"><a className={`${linkStyles} inline-flex items-center gap-2`} href="https://my-portfolio-1-0.onrender.com" target="_blank" rel="noreferrer"><span aria-hidden="true" className="render-mark" /> Render</a></FooterCell>
          <FooterCell label="Source code"><a className={linkStyles} href={SOURCE_URL} target="_blank" rel="noreferrer">GitHub</a></FooterCell>
          <FooterCell label="License"><a className={linkStyles} href={`${SOURCE_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT License</a></FooterCell>
          <FooterCell label="Typeface">Hanken Grotesk</FooterCell>
        </div>

        <div className="footer-grid footer-grid-two">
          <FooterCell label="Stack" className="footer-tall">
            <div>react@19.1.1</div><div>tailwindcss@4.1.16</div><div>vite@7.1.7</div><div>express@5</div>
          </FooterCell>
          <FooterCell label="Analytics" className="footer-tall">
            {analytics.map((item, index) => <div key={item} className={index === analytics.length - 1 && visitorStats ? "footer-online" : ""}>{item}</div>)}
          </FooterCell>
        </div>

        <div className="footer-inspired">
          <span className="footer-label">Inspired by</span>
          <div className="footer-inspired-grid">
            {["Tailwind CSS", "shadcn/ui", "Vercel", "Evil Charts", "Devouring Details", "Skiper UI", "Making Software", "shadcncraft"].map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <BrandLogo className="h-8 w-12 text-[var(--color-secondary-text)]" />
          <span>© 2026 · Meghraj Thakre</span>
          <nav aria-label="Social links">
            <a href="https://x.com/meghraj_thakre1" target="_blank" rel="noreferrer" aria-label="X profile"><FaXTwitter /></a><i />
            <a href={SOURCE_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository"><FaGithub /></a><i />
            <a href="https://www.linkedin.com/in/meghraj-thakre-01a09b23a/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><FaLinkedin /></a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
