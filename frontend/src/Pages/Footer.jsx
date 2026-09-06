import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import BrandLogo from "../components/layout/Navbar/BrandLogo";
import { getVisitSummary } from "../services/analyticsService";
import { getGithubBuildNumber } from "../services/githubService";

const SOURCE_URL = "https://github.com/meghrajthakre/My-portfolio";
const border = "border-[var(--color-border)]";
const labelStyles = "mb-2 block text-[11px] uppercase leading-none tracking-[0.08em] text-[var(--color-secondary-text)]";
const linkStyles = "text-[var(--color-text)] underline decoration-[var(--color-secondary-text)] underline-offset-4 transition-colors hover:text-[var(--logo-bg)]";

const FooterCell = ({ label, children, className = "" }) => (
  <div className={`min-h-[81px] min-w-0 border-b border-r border-dashed ${border} p-[17px_20px] ${className}`}>
    <span className={labelStyles}>{label}</span>
    <div className="break-words text-base font-medium leading-[1.45] text-[var(--color-text)] max-[440px]:text-sm">{children}</div>
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
    <footer className="mx-auto mt-20 w-full max-w-3xl px-5 pb-9 font-[var(--font-main)] max-sm:mt-14">
      <div className={`overflow-hidden border-l border-t border-dashed ${border}`}>
        <div className={`flex min-h-[55px] items-center justify-between gap-8 border-b border-r border-dashed ${border} px-5 max-sm:flex-col max-sm:items-start max-sm:gap-1 max-sm:py-4`}>
          <a href="https://thakre.services" target="_blank" rel="noreferrer" className="whitespace-nowrap text-base font-bold text-[var(--color-text)]">thakre.services</a>
          <p className="m-0 text-right text-base leading-snug text-[var(--color-secondary-text)] max-sm:text-left max-sm:text-[13px]">A full-stack dev portfolio, built with code and curiosity.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4">
          <FooterCell label="Crafted by"><a className={linkStyles} href="https://github.com/meghrajthakre" target="_blank" rel="noreferrer">@meghrajthakre</a></FooterCell>
          <FooterCell label="Build"><a className={linkStyles} href={`${SOURCE_URL}/commits`} target="_blank" rel="noreferrer">dc{buildNumber ?? "—"}</a></FooterCell>
          <FooterCell label="Date">2026-09-06</FooterCell>
          <FooterCell label="Registry">portfolio v1.0</FooterCell>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4">
          <FooterCell label="Deployed on"><a className={`${linkStyles} inline-flex items-center gap-2`} href="https://my-portfolio-1-0.onrender.com" target="_blank" rel="noreferrer"><span aria-hidden="true" className="h-0 w-0 border-x-[7px] border-b-[13px] border-x-transparent border-b-current" /> Render</a></FooterCell>
          <FooterCell label="Source code"><a className={linkStyles} href={SOURCE_URL} target="_blank" rel="noreferrer">GitHub</a></FooterCell>
          <FooterCell label="License"><a className={linkStyles} href={`${SOURCE_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT License</a></FooterCell>
          <FooterCell label="Typeface">Hanken Grotesk</FooterCell>
        </div>

        <div className="grid grid-cols-1 min-[441px]:grid-cols-2">
          <FooterCell label="Stack" className="min-h-[137px]"><div>react@19.1.1</div><div>tailwindcss@4.1.16</div><div>vite@7.1.7</div><div>express@5</div></FooterCell>
          <FooterCell label="Analytics" className="min-h-[137px]">
            {analytics.map((item, index) => <div key={item} className="flex items-center gap-2">{index === analytics.length - 1 && visitorStats && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_9px_#22c55e]" />}{item}</div>)}
          </FooterCell>
        </div>

        <div className={`border-b border-r border-dashed ${border} p-[17px_20px_15px]`}>
          <span className={labelStyles}>Inspired by</span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4 sm:gap-x-6">
            {["Tailwind CSS", "shadcn/ui", "Vercel", "chanhdai.com", "Devouring Details", "Skiper UI", "ramx.in", "shadcncraft"].map((item, index) => (
              <div className="flex min-w-0 gap-2.5" key={item}><span className="italic text-[var(--color-secondary-text)]">{String(index + 1).padStart(2, "0")}</span><strong className="text-[13px] font-semibold text-[var(--color-text)] sm:whitespace-nowrap sm:text-[15px]">{item}</strong></div>
            ))}
          </div>
        </div>

        <div className={`grid min-h-[66px] grid-cols-[1fr_auto] items-center gap-5 border-b border-r border-dashed ${border} px-5 sm:grid-cols-[1fr_auto_1fr]`}>
          <BrandLogo className="h-8 w-12 text-[var(--color-secondary-text)]" />
          <span className="hidden text-xs text-[var(--color-secondary-text)] sm:block">© 2026 · Meghraj Thakre</span>
          <nav className="flex items-center justify-end gap-3 text-lg text-[var(--color-secondary-text)]" aria-label="Social links">
            <a className="transition-colors hover:text-[var(--color-text)]" href="https://x.com/meghraj_thakre1" target="_blank" rel="noreferrer" aria-label="X profile"><FaXTwitter /></a><i className={`h-[22px] w-px bg-[var(--color-border)]`} />
            <a className="transition-colors hover:text-[var(--color-text)]" href={SOURCE_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository"><FaGithub /></a><i className={`h-[22px] w-px bg-[var(--color-border)]`} />
            <a className="transition-colors hover:text-[var(--color-text)]" href="https://www.linkedin.com/in/meghraj-thakre-01a09b23a/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><FaLinkedin /></a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
