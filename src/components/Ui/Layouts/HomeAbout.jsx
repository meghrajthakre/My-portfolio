import React from 'react'
import { techStack } from '../../../data/techStack'
import { NavLink } from 'react-router-dom'

const HomeAbout = () => {
    return (
        <div className="mt-10">
            {/* 🔹 Heading */}
            <div className=" gap-0.5 md:text-left">
                <h3 className="text-base md:text-lg">About</h3>
                <h2 className="text-2xl md:text-3xl font-semibold">Me</h2>
            </div>

            {/* 🔹 Main Content */}
            <div className="py-6 flex flex-col md:flex-row  md:items-start justify-around gap-8">
                
                {/* 🔹 Profile / Logo */}
                <div
                    className="border-secondary size-60 rounded-md border-2 bg-blue-300 dark:bg-yellow-300"
                    style={{ backgroundColor: "var(--logo-bg)" }}
                >
                    <img
                        src="src/assets/Logo/logo (1).webp"
                        alt="Meghraj Thakre logo"
                        className="object-contain"
                    />
                </div>

                {/* 🔹 About Section */}
                <div className="w-full md:w-[60%] flex flex-col gap-4  md:text-left">
                    <h2 className="text-xl font-medium">Meghraj Thakre</h2>
                    <span className="text-sm md:text-base leading-relaxed text-[var(--color-secondary-text)]">
                        I’m a Full Stack Web Developer who loves building complete web applications from start to finish.
                        I create clean and responsive frontends with React and build secure, fast backends using Node.js and Express.
                    </span>

                    {/* 🔹 Skills Section */}
                    <div className="flex flex-col gap-2 ">
                        <span className="font-medium text-lg">Skills</span>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            {techStack.map((tech) => (
                                <NavLink
                                    key={tech.name}
                                    to={tech.link || "#"}
                                    className=" w-6 h-6 hover:scale-110 transition-transform duration-200"
                                >
                                    {tech.icon ? (
                                        <img
                                            src={tech.icon}
                                            alt={tech.name}
                                            className="w-6 h-6 md:w-7 md:h-7 object-contain"
                                        />
                                    ) : null}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeAbout
