// src/data/techStack.js
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiExpress, SiMongodb, SiFramer, SiGreensock } from "react-icons/si";

export const techStack = [
  {
    name: "React",
    Icon: FaReact,
    link: "https://react.dev",
    color: "#61DAFB", // light blue
  },
  {
    name: "Node.js",
    Icon: FaNodeJs,
    link: "https://nodejs.org",
    color: "#68A063", // green
  },
  {
    name: "Express.js",
    Icon: SiExpress,
    link: "https://expressjs.com",
    color: "#AAAAAA", // gray
  },
  {
    name: "MongoDB",
    Icon: SiMongodb,
    link: "https://www.mongodb.com",
    color: "#4DB33D", // mongo green
  },
  {
    name: "GSAP",
    Icon: SiGreensock,
    link: "https://greensock.com/gsap/",
    color: "#88CE02", // gsap green
  },
  {
    name: "Framer Motion",
    Icon: SiFramer,
    link: "https://www.framer.com/motion/",
    color: "#E829F7", // purple-pink
  },
];
