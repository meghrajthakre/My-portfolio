import React from "react";
import { FiDownload } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Resume = () => {
  return (
    <div className="relative max-w-3xl m-auto px-8">
      {/* 🔹 Heading */}
      <h2 className="text-center text-2xl font-semibold mb-8 mt-10">My Resume</h2>

      {/* 🔹 Lazy Loaded Image */}
      <div className="mt-8 mb-8">
        <LazyLoadImage
          src="/resume/resume.jpg"
          alt="My Resume"
          effect="blur" // smooth fade-in blur effect
          className="w-full rounded-lg shadow-md"
        />
      </div>

      {/* 🔹 Centered Download Button */}
      <div className="flex justify-center">
        <a
          href="/resume/resume (4).pdf" // ✅ File from public/resume folder
          download
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download my resume as PDF"
          className="flex items-center gap-2 
          text-[var(--color-secondary-text)]
          border border-dashed border-[var(--color-secondary-text)] 
          px-4 py-2 rounded-md font-medium text-sm 
          shadow-md hover:shadow-lg transition-all 
          duration-300 hover:border-[var(--color-text)]"
        >
          <FiDownload className="text-[var(--color-secondary-text)] w-5 h-5" />
          Download
        </a>
      </div>
    </div>
  );
};

export default Resume;
