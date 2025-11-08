import React from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";
import { SiTailwindcss, SiMongodb } from "react-icons/si";

const skills = [
  { icon: <FaHtml5 className="w-8 h-8 text-orange-600" />, name: "HTML" },
  { icon: <FaCss3Alt className="w-8 h-8 text-blue-600" />, name: "CSS" },
  { icon: <FaJs className="w-8 h-8 text-yellow-400" />, name: "JavaScript" },
  { icon: <FaReact className="w-8 h-8 text-sky-400" />, name: "React" },
  { icon: <FaNodeJs className="w-8 h-8 text-green-600" />, name: "NodeJS" },
  { icon: <SiTailwindcss className="w-8 h-8 text-teal-400" />, name: "Tailwind" },
  { icon: <SiMongodb className="w-8 h-8 text-green-500" />, name: "MongoDB" },
];

const InfiniteSlider = () => {
  return (
    <div className="overflow-hidden w-full py-14">
      <h2 className="font-medium  pb-4 ">Skills</h2>

      <div className="slider relative w-full overflow-hidden">
        <div className="slider-track flex gap-4 animate-scroll">
          {[...skills, ...skills].map((skill, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center w-20 flex-shrink-0"
            >
              {skill.icon}
              <span className="text-xs mt-2">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteSlider;
