import React from 'react'
import DownloadButton from '../DownloadButton'
import GetInTouchButton from '../GetInTouchButton'
import SocialMediaicons from '../SocialMediaicons'

const Introduction = () => {
  return (
    <div className='mx-auto max-w-3xl px-8 py-14'>
      <div>
        {/* heading */}
        <div className='inline-block'>
          <img
            className='h-24 w-24 rounded-full transition-all duration-300 ease-in-out bg-yellow-300'
            src="/src/assets/Logo/logo (1).webp"
            alt="Logo"
            loading="lazy"
          />
        </div>
        {/* description */}
        <div className='py-8'>
          {/* heading */}
          <span className='text-[34px] font-bold text-[var(--color-text)]'>
            Hi, I'm Meghraj
            <span className='px-2'>—</span>
            <span className='text-[var(--color-secondary-text)]'>
              I Make Softwares For Web.
            </span>
          </span>

          {/* description */}
          <p className="mt-4 tracking-tight flex gap-1 flex-wrap items-center text-base md:text-lg text-[var(--color-muted)]">
            My toolkit?&nbsp;&nbsp;&nbsp;

            {/* React */}
            <a
              href="https://react.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 bg-[var(--color-icons-bg)] text-[var(--color-text)] px-2 py-1 tracking-tight rounded-sm border border-dashed border-[var(--color-muted)] font-bold transition duration-300 hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
            >
              <img
                src="src/assets/SvgsLogo/react.svg"
                alt="React"
                width="18"
                height="18"
              />
              React
            </a>
            &nbsp;

            {/* JavaScript */}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 bg-[var(--color-icons-bg)] text-[var(--color-text)] px-2 py-1 tracking-tight rounded-sm border border-dashed border-[var(--color-muted)] font-bold transition duration-300 hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
            >
              <img
                src="src/assets/SvgsLogo/js.svg"
                alt="JavaScript"
                width="18"
                height="18"
              />
              JavaScript
            </a>
            &nbsp;

            {/* Node.js */}
            <a
              href="https://nodejs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 bg-[var(--color-icons-bg)] text-[var(--color-text)] px-2 py-1 tracking-tight rounded-sm border border-dashed border-[var(--color-muted)] font-bold transition duration-300 hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
            >
              <img
                src="src/assets/SvgsLogo/node.svg"
                alt="Node.js"
                width="18"
                height="18"
              />
              Node.js
            </a>
            &nbsp;

            {/* Express */}
            <a
              href="https://expressjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 bg-[var(--color-icons-bg)] text-[var(--color-text)] px-2 py-1 tracking-tight rounded-sm border border-dashed border-[var(--color-muted)] font-bold transition duration-300 hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
            >
              <img
                src="src/assets/SvgsLogo/exp.svg"
                alt="Express.js"
                width="18"
                height="18"
              />
              Express JS
            </a>
            &nbsp;

            {/* MongoDB */}
            <a
              href="https://www.mongodb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 bg-[var(--color-icons-bg)] text-[var(--color-text)] px-2 py-1 tracking-tight rounded-sm border border-dashed border-[var(--color-muted)] font-bold transition duration-300 hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
            >
              <img
                src="src/assets/SvgsLogo/mongodb.svg"
                alt="MongoDB"
                width="18"
                height="18"
              />
              MongoDB
            </a>

            {/* GSAP */}
            and a bit of&nbsp;
            <a
              href="https://gsap.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 bg-[var(--color-icons-bg)] text-[var(--color-text)] px-2 py-1 tracking-tight rounded-sm border border-dashed border-[var(--color-muted)] font-bold transition duration-300 hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
            >
              <img
                src="src/assets/SvgsLogo/gsap.svg"
                alt="GSAP"
                width="18"
                height="18"
              />
              GSAP
            </a>

            magic to make things move just right — a developer who believes code is
            just another form of creativity. Mixing logic, motion, and design into
            something users actually enjoy using.
          </p>
        </div>

        {/* buttons */}
        <div className='flex items-center gap-4'>
          <DownloadButton />
          <GetInTouchButton />

        </div>

        {/* Social icons */}
        <div className='pt-10'>
            <SocialMediaicons/>
        </div>

      </div>
    </div>
  )
}

export default Introduction
