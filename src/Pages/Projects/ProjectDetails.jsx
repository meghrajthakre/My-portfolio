import React from "react";
import { useParams } from "react-router-dom";
import { ProjectsData } from "../../data/ProjectsData";
import { FaGithub } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import Tooltip from "../../common/Tooltip";

const ProjectDetails = () => {
    const { id } = useParams();
    const project = ProjectsData.find((p) => p.id === Number(id));

    if (!project) {
        return (
            <div
                role="alert"
                className="text-center mt-20 text-xl text-gray-400"
                aria-live="polite"
            >
                Project not found Brother  😕
            </div>
        );
    }

    const {
        title = "Untitled Project",
        description = "",
        image = "",
        fullDescription = "",
        techStack = [],
        timeline = "—",
        role = "—",
        team = "—",
        isComplete = false,
        github = "#",
        website = "#",
    } = project;

    return (
        <article
            className="max-w-3xl mx-auto mt-8 px-8"
            aria-labelledby="project-title"
        >
            {/* 🌐 SEO Meta Tags */}
            <title>{title} | Portfolio</title>

            {/* 🏷️ Title + Description */}
            <header className="text-center mb-8">
                <h1
                    id="project-title"
                    className="text-4xl font-bold text-[var(--color-text)] mb-3"
                >
                    {title}
                </h1>
                <p className="text-[var(--color-secondary-text)] text-base leading-relaxed">
                    {description}
                </p>
            </header>

            {/* 🖼️ Project Image */}
            <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-700">
                <img
                    src={image}
                    alt={`${title} project screenshot`}
                    className="w-full min-h-[300px] max-h-[380px] object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>

            {/* 🧾 Details Section */}
            <section className="mt-6 flex flex-col gap-6">
                {/* ✅ Status + Links */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Status */}
                    <div
                        className="flex items-center gap-2"
                        aria-label={`Status: ${isComplete ? "Completed" : "In Progress"}`}
                    >
                        <span
                            className={`w-3 h-3 rounded-full ${isComplete ? "bg-green-500" : "bg-yellow-500"
                                } animate-pulse`}
                        ></span>
                        <span
                            className={`font-medium mt-1 block ${isComplete ? "!text-green-600" : "!text-yellow-600"
                                }`}
                        >
                            {isComplete ? "Completed" : "In Progress"}
                        </span>

                    </div>

                    {/* Links */}
                    <nav
                        className="flex items-center gap-6"
                        aria-label="Project external links"
                    >
                        <Tooltip text="Visit Website">
                            <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer external"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg dashed
                  bg-[var(--color-card-bg)] text-[var(--color-text)] font-medium
                  hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]
                  transition-all duration-300 shadow-sm"
                                aria-label="Visit live website"
                            >
                                <FaEarthAmericas className="text-xl" />
                                <span>Live Demo</span>
                            </a>
                        </Tooltip>

                        <Tooltip text="View Code">
                            <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer external"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg dashed
                  bg-[var(--color-card-bg)] text-[var(--color-text)] font-medium
                  hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]
                  transition-all duration-300 shadow-sm"
                                aria-label="View source code on GitHub"
                            >
                                <FaGithub className="text-xl" />
                                <span>Source Code</span>
                            </a>
                        </Tooltip>
                    </nav>
                </div>

                {/* 📖 Full Description */}
                <section aria-label="Project description" className="mt-4">
                    <h4 className="text-3xl font-bold text-[var(--color-text)] mb-3">
                        About the Project
                    </h4>
                    <p className="text-[var(--color-secondary-text)] text-lg leading-relaxed">
                        {fullDescription}
                    </p>
                </section>

                {/* 📅 Project Info Table (Timeline, Role, Team, Status) */}
                <section
                    className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center"
                    aria-label="Project information summary"
                >
                    {/* Timeline */}
                    <div className="dashed rounded-xl p-4 bg-[var(--color-card-bg)] hover:scale-[1.02] transition">
                        <h4 className="text-sm font-semibold text-[var(--color-text)]">
                            Timeline
                        </h4>
                        <span className="font-medium mt-1 block">{timeline}</span>
                    </div>

                    {/* Role */}
                    <div className="dashed rounded-xl p-4 bg-[var(--color-card-bg)] hover:scale-[1.02] transition">
                        <h4 className="text-sm font-semibold text-[var(--color-text)]">
                            Role
                        </h4>
                        <span className="font-medium mt-1 block">{role}</span>
                    </div>

                    {/* Team */}
                    <div className="dashed rounded-xl p-4 bg-[var(--color-card-bg)] hover:scale-[1.02] transition">
                        <h4 className="text-sm font-semibold text-[var(--color-text)]">
                            Team
                        </h4>
                        <span className="font-medium mt-1 block">{team}</span>
                    </div>

                    {/* Status */}
                    <div className="dashed rounded-xl p-4 bg-[var(--color-card-bg)] hover:scale-[1.02] transition">
                        <h4 className="text-sm font-semibold ">
                            Status
                        </h4>
                        <span
                            className={`font-medium mt-1 block ${isComplete ? "!text-green-600" : "!text-yellow-600"
                                }`}
                        >
                            {isComplete ? "Completed" : "In Progress"}
                        </span>
                    </div>
                </section>

                {/* ⚙️ Technologies */}
                <section
                    className="bg-[var(--color-card-bg)] rounded-2xl p-6 dashed"
                    aria-label="Technologies used"
                >
                    <h3 className="font-semibold text-xl mb-4 text-[var(--color-text)]">
                        Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
                        {techStack.map((tech) => {
                            const TechIcon = tech.Icon;
                            return (
                                <div
                                    key={tech.name}
                                    className="flex flex-col items-center gap-1 transition-transform duration-300 hover:scale-110"
                                    aria-label={`Technology: ${tech.name}`}
                                >
                                    <TechIcon
                                        className="text-xl"
                                        style={{ color: tech.color }}
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm text-[var(--color-secondary-text)]">
                                        {tech.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>
                {/* Key Challenges */}

                <section className="mt-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-3">
                            Key Challenges :
                        </h2>
                        <ul className="list-disc list-inside space-y-2">
                            {project.keyChallenges.map((challenge, index) => (
                                <li
                                    key={index}
                                    className="
            text-red-600 dark:text-red-400 
            bg-red-100 dark:bg-red-950/30 
            border border-red-200 dark:border-red-800/30 
            px-4 py-2 rounded-xl 
            hover:bg-red-200 dark:hover:bg-red-900/40 
            transition duration-300
          "
                                >
                                    {challenge}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Key Learnings */}
                    <div>
                        <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-3">
                            Key Learnings :
                        </h2>
                        <ul className="list-disc list-inside space-y-2">
                            {project.learnings.map((learning, index) => (
                                <li
                                    key={index}
                                    className="
            text-green-600 dark:text-green-400 
            bg-green-100 dark:bg-green-950/30 
            border border-green-200 dark:border-green-800/30 
            px-4 py-2 rounded-xl 
            hover:bg-green-200 dark:hover:bg-green-900/40 
            transition duration-300
          "
                                >
                                    {learning}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>



            </section>
        </article>
    );
};

export default ProjectDetails;
