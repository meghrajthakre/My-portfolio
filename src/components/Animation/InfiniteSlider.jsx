import React from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";
import { SiTailwindcss, SiMongodb } from "react-icons/si";
import { 
  FaCode, 
  FaNetworkWired, 
  FaVideo, 
  FaBullhorn,
  FaTwitter
} from "react-icons/fa";

import { 
  SiVscodium, 
  SiLeetcode, 
  SiPython,

  SiAdobephotoshop, 
  SiCanva 
} from "react-icons/si";


const skills = [
  { icon: <FaHtml5 className="w-8 h-8 text-orange-600" />, name: "HTML" },
  { icon: <FaCss3Alt className="w-8 h-8 text-blue-600" />, name: "CSS" },
  { icon: <FaJs className="w-8 h-8 text-yellow-400" />, name: "JavaScript" },
  { icon: <FaReact className="w-8 h-8 text-sky-400" />, name: "React" },
  { icon: <FaNodeJs className="w-8 h-8 text-green-600" />, name: "NodeJS" },
  { icon: <SiTailwindcss className="w-8 h-8 text-teal-400" />, name: "Tailwind" },
  { icon: <SiMongodb className="w-8 h-8 text-green-500" />, name: "MongoDB" },
];
const skills2 = [
  { icon: <SiVscodium className="w-7 h-7 text-blue-500" />, name: "VS Code" },
  { icon: <SiLeetcode className="w-7 h-7 text-orange-500" />, name: "DSA" },
  { icon: <FaNetworkWired className="w-7 h-7 text-blue-600" />, name: "Networking" },
    { icon: <SiPython className="w-8 h-8 text-yellow-500" />, name: "Python" },

  { icon: <FaVideo className="w-7 h-7 text-red-500" />, name: "Video Editing" },
  { icon: <SiCanva className="w-7 h-7 text-purple-500" />, name: "Canva" },
  { icon: <SiAdobephotoshop className="w-7 h-7 text-blue-700" />, name: "Photoshop" },
  { icon: <FaTwitter className="w-7 h-7" />, name: "Twitter / X" },
  { icon: <FaBullhorn className="w-7 h-7 text-yellow-500" />, name: "Speaking Skills" },
  { icon: <FaCode className="w-7 h-7 text-green-600" />, name: "Problem Solving" },
];


const InfiniteSlider = () => {
  return (
    <div className="overflow-hidden w-full py-14">
      <h2 className="font-medium pb-4">Skills</h2>

      {/* Left Scroll */}
      <div className="slider relative w-full overflow-hidden">
        <div className="flex gap-4 animate-scroll-left">
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

      {/* Right Scroll */}
      <div className="slider-2 mt-10 relative w-full overflow-hidden">
        <div className="flex gap-4 animate-scroll-right">
          {[...skills2, ...skills2].map((skill, idx) => (
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
