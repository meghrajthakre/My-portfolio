import React from "react";
import {
    FaDownload,
    FaFileCode,
    FaFont,
    FaCogs,
    FaPuzzlePiece,
    FaExternalLinkAlt,
} from "react-icons/fa";

const steps = [
    {
        icon: <FaFont className="text-xl text-blue-400" />,
        title: "Step 1: Install Font",
        description:
            "Download and install the Fira Code font for better coding ligatures and readability.",
        file: {
            name: "Fira_Code_v6.2.zip",
            link: "src/data/vscodeFiles/Fira_Code_v6.2.zip",
        },
    },
    {
        icon: <FaFileCode className="text-xl text-green-400" />,
        title: "Step 2: Add VS Code Settings",
        description:
            "Download my pre-configured settings.json file and replace your current one in VS Code.",
        file: {
            name: "settings.json",
            link: "src/data/vscodeFiles/settings.json",
        },
    },
    {
        icon: <FaPuzzlePiece className="text-xl text-purple-400" />,
        title: "Step 3: Install Extensions",
        file: {
            name: "All-extensions.text",
            link: "src/data/vscodeFiles/vsc-extensions.txt",
        },
        description:
            "Click on the names below to install my recommended extensions directly from the VS Code Marketplace.",
        extensions: [
            { id: "ritwickdey.liveserver", name: "Live Server" },
            { id: "bradlc.vscode-tailwindcss", name: "Tailwind CSS IntelliSense" },
            { id: "rodrigovallades.es7-react-js-snippets", name: "ES7+ React/Redux/React-Native Snippets" },
            { id: "vscode-icons-team.vscode-icons", name: "VSCode Icons" },
            { id: "usernamehw.errorlens", name: "Error Lens" },
            { id: "wakatime.vscode-wakatime", name: "WakaTime" },
            { id: "rangav.vscode-thunder-client", name: "Thunder Client (API Testing)" },
            { id: "omkarbhede.react-icons-auto-import", name: "React Icons Auto Import" },
            { id: "xabikos.javascriptsnippets", name: "JavaScript (ES6) Code Snippets" },
            { id: "wix.vscode-import-cost", name: "Import Cost" },
            { id: "nucllear.vscode-extension-auto-import", name: "Auto Import" },
            { id: "sinclair.react-developer-tools", name: "React Developer Tools" },
            { id: "pawelborkar.jellyfish", name: "JellyFish Theme" },
        ],
    },
    {
        icon: <FaCogs className="text-xl text-orange-400" />,
        title: "Step 4: Final Setup",
        description:
            "Restart VS Code, choose the ‘JellyFish’ theme, and set ‘Fira Code’ as your font family — setup complete!",
    },
];

const VscodeSetup = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 mt-10 text-[var(--color-text)]">
            {/* Header */}
            <header className="text-center pb-8 sm:pb-10 border-b border-[var(--color-border)] flex flex-col items-center gap-3 sm:gap-4">
                <h4 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent break-words">
                    VS Code Setup
                </h4>
                <p className="text-[var(--color-muted)] max-w-lg text-sm sm:text-base px-2 sm:px-0">
                    My personal VS Code setup for a clean, productive development
                    experience — fonts, settings, and extensions all in one place.
                </p>
            </header>

            {/* Steps */}
            <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="bg-[var(--color-card)]/60 backdrop-blur-xl dashed rounded-2xl p-4 sm:p-6 transition-all duration-300"
                    >
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                            {step.icon}
                            <span className="text-xl sm:text-2xl font-semibold text-[var(--color-heading)]">
                                {step.title}
                            </span>
                        </div>

                        <p className="text-[var(--color-muted)] text-sm sm:text-base mb-4 leading-relaxed">
                            {step.description}
                        </p>

                        {/* Download Button */}
                        {step.file && (
                            <a
                                href={step.file.link}
                                download
                                className="inline-flex items-center gap-2 w-full sm:w-auto justify-center border border-[var(--color-border)] backdrop-blur-md text-[var(--color-heading)] px-4 py-2 rounded-xl transition-all duration-300 hover:bg-[var(--color-bg)] hover:text-white shadow-sm text-sm sm:text-base"
                            >
                                <FaDownload className="text-[var(--color-accent)] group-hover:text-white transition-all" />
                                <span>{step.file.name}</span>
                            </a>
                        )}

                        {/* Extensions */}
                        {step.extensions && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {step.extensions.map((ext, i) => (
                                    <a
                                        key={i}
                                        href={`https://marketplace.visualstudio.com/items?itemName=${ext.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between border border-[var(--color-border)] bg-[var(--color-card)]/70 px-3 py-2 rounded-xl text-[var(--color-text)] text-sm sm:text-base transition-all duration-300 hover:bg-[var(--color-accent)]"
                                    >
                                        <span className="truncate">{ext.name}</span>
                                        <FaExternalLinkAlt className="opacity-80 text-xs sm:text-sm" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ✅ Done Message */}
            <div className="text-center mt-10 sm:mt-12">
                <p className="font-semibold text-base sm:text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                     Setup Complete — You’re all set to code like a pro!
                </p>
            </div>

        </div>
    );
};

export default VscodeSetup;
