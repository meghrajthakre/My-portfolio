import { FaReact, FaNodeJs, FaCss3Alt, FaJs } from "react-icons/fa";
import { SiExpress, SiMongodb } from "react-icons/si";

export const ProjectsData = [
  {
    id: 1,
    title: "Study Platform",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60",
    description:
      "A comprehensive study platform with notes, flashcards, quizzes, AI chatbot, and interactive learning tools.",
    website: "#",
    github: "#",
    status: "All Systems Operational",
    techStack: [
      { name: "React", Icon: FaReact, color: "#61DAFB" },
      { name: "JavaScript", Icon: FaJs, color: "#F7DF1E" },
      { name: "Node.js", Icon: FaNodeJs, color: "#3C873A" },
      { name: "Express.js", Icon: SiExpress, color: "#AAAAAA" },
      { name: "MongoDB", Icon: SiMongodb, color: "#4DB33D" },
    ],
  },
  {
    id: 2,
    title: "Weather App",
    image:
      "https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=800&q=60",
    description:
      "Live weather tracking app using OpenWeather API with search and temperature graph.",
    website: "#",
    github: "#",
    status: "All Systems Operational",
    techStack: [
      { name: "React", Icon: FaReact, color: "#61DAFB" },
      { name: "CSS", Icon: FaCss3Alt, color: "#2965F1" },
      { name: "JavaScript", Icon: FaJs, color: "#F7DF1E" },
      { name: "Node.js", Icon: FaNodeJs, color: "#3C873A" },
    ],
  },
  {
    id: 3,
    title: "Portfolio Website",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60",
    description:
      "Personal portfolio built with React, showcasing projects and interactive animations using Framer Motion.",
    website: "#",
    github: "#",
    status: "All Systems Operational",
    techStack: [
      { name: "React", Icon: FaReact, color: "#61DAFB" },
      { name: "CSS", Icon: FaCss3Alt, color: "#2965F1" },
      { name: "JavaScript", Icon: FaJs, color: "#F7DF1E" },
    ],
  },
  {
    id: 4,
    title: "MERN Dashboard",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
    description:
      "A full-stack admin dashboard with charts, authentication, and CRUD APIs built using the MERN stack.",
    website: "#",
    github: "#",
    status: "All Systems Operational",
    techStack: [
      { name: "React", Icon: FaReact, color: "#61DAFB" },
      { name: "Node.js", Icon: FaNodeJs, color: "#3C873A" },
      { name: "Express.js", Icon: SiExpress, color: "#AAAAAA" },
      { name: "MongoDB", Icon: SiMongodb, color: "#4DB33D" },
    ],
  },
];
