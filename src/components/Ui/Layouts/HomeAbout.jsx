import React from "react";

import { FaEnvelope } from "react-icons/fa";
const HomeAbout = () => {
    return (
        <div className="mt-10">
            {/* 🔹 Heading */}
            <div className="gap-0.5 md:text-left">
                <h3 className="text-base md:text-lg">About</h3>
                <h2 className="text-2xl md:text-3xl font-semibold">Me</h2>
            </div>

            {/* 🔹 Main Content */}
            <div className="py-6 flex flex-col md:flex-row md:items-start justify-around gap-8">
                {/* 🔹 Profile / Logo */}
                <div
                    className="size-60 rounded-md dashed rounded-md bg-blue-300 dark:bg-yellow-300"
                    style={{ backgroundColor: "var(--logo-bg)" }}
                >
                    <img
                        src="/Logo/logo (1).webp"
                        alt="Meghraj Thakre logo"
                        className="object-contain "
                    />
                </div>

                {/* 🔹 About Section */}
                <div className="w-full md:w-[60%] flex flex-col gap-4 md:text-left">
                    <h2 className="text-xl font-medium">Meghraj Thakre</h2>
                    <span className="text-sm md:text-base leading-relaxed text-[var(--color-secondary-text)]">
                        I’m a{" "}
                        <span className="brand text-[var(--color-text)] -tracking-tight">
                            Full Stack Web Developer
                        </span>{" "}
                        who loves building complete web applications from start to finish.
                        I create clean and responsive frontends with React and build secure,
                        fast backends using Node.js and Express.
                    </span>

                    {/* 🔹 Skills Section */}
                    <div className="flex items-center mt-2.5 gap-2">
                        <FaEnvelope className="w-5 h-5 " />
                        <h5 className="-tracking-tight font-medium text-md py-2 text-[var(--color-secondary-text)]">Meghrajthakre444@gmail.com</h5>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeAbout;
