import {
  FaReact,
  FaNodeJs,
  FaCss3Alt,
  FaJs,
} from "react-icons/fa";
import {
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiFramer,
  SiShadcnui,
} from "react-icons/si";

export const ProjectsData = [
  {
    id: 1,
    title: "Study Platform",
    timeline: "March 2025 – May 2025",
    role: "Frontend Developer",
    team: "3 Members",
    isComplete: true,
    image:
      "https://images.unsplash.com/photo-1762127488978-6cdd28deb884?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    description:
      "An interactive study platform offering notes, quizzes, flashcards, and AI assistance for students.",
    fullDescription:
      "This platform was designed to make studying efficient and enjoyable. It includes AI-driven question answering, a customizable flashcard system, a quiz generator, and a progress tracker. I focused on optimizing UI transitions and maintaining state consistency using React Context and custom hooks. The backend was powered by Node.js and MongoDB for scalable data handling.",
    keyChallenges: [
      "Managing complex global state across multiple modules.",
      "Optimizing UI and transitions for seamless performance.",
      "Handling API-heavy operations efficiently.",
    ],
    learnings: [
      "Improved understanding of Context API and custom hooks.",
      "Enhanced async handling and performance optimization.",
      "Built scalable and maintainable frontend architecture.",
    ],
    website: "#",
    github: "#",
    techStack: [
      { name: "React", Icon: FaReact, color: "#61DAFB" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#38B2AC" },
      { name: "Framer Motion", Icon: SiFramer, color: "#E100FF" },
      { name: "ShadCN/UI", Icon: SiShadcnui, color: "#000000" },
      { name: "Node.js", Icon: FaNodeJs, color: "#3C873A" },
      { name: "Express.js", Icon: SiExpress, color: "#AAAAAA" },
      { name: "MongoDB", Icon: SiMongodb, color: "#4DB33D" },
    ],
  },
  {
    id: 2,
    title: "Weather App",
    isComplete: true,
    image:
      "https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=800&q=60",
    description:
      "Live weather tracking app using OpenWeather API with search and temperature graph.",
    fullDescription:
      "The Weather App allows users to search any city and view live weather data, temperature graphs, and humidity information using the OpenWeather API. It features clean UI, error handling, and responsive layout for mobile and desktop users.",
    keyChallenges: [
      "Handling invalid API requests and network errors gracefully.",
      "Designing a fully responsive UI for all screen sizes.",
      "Managing dynamic weather data updates in real-time.",
    ],
    learnings: [
      "Gained experience in API integration and async JavaScript.",
      "Improved error handling and UX consistency.",
      "Enhanced responsive design and layout structuring skills.",
    ],
    website: "#",
    github: "#",
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
    isComplete: true,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60",
    description:
      "Personal portfolio built with React, showcasing projects and interactive animations using Framer Motion.",
    fullDescription:
      "My portfolio website highlights my web development work, skills, and projects. Built with React and Framer Motion for smooth transitions and an engaging experience. It features dark/light mode and reusable components.",
    keyChallenges: [
      "Creating reusable and theme-based UI components.",
      "Integrating Framer Motion for fluid animations.",
      "Maintaining performance and SEO optimization.",
    ],
    learnings: [
      "Enhanced understanding of React architecture.",
      "Improved knowledge of animations and accessibility.",
      "Gained experience in optimizing React for performance.",
    ],
    website: "#",
    github: "#",
    techStack: [
      { name: "React", Icon: FaReact, color: "#61DAFB" },
      { name: "CSS", Icon: FaCss3Alt, color: "#2965F1" },
      { name: "JavaScript", Icon: FaJs, color: "#F7DF1E" },
    ],
  },
  {
    id: 4,
    title: "MERN Dashboard",
    isComplete: false,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
    description:
      "A full-stack admin dashboard with charts, authentication, and CRUD APIs built using the MERN stack.",
    fullDescription:
      "The MERN Dashboard is an analytics and management app with protected routes, charts, user authentication, and role-based access. It uses MongoDB and Express for the backend, with React handling the frontend views.",
    keyChallenges: [
      "Implementing JWT authentication and protected routes.",
      "Integrating data-heavy charts efficiently.",
      "Managing backend communication and CORS issues.",
    ],
    learnings: [
      "Mastered JWT-based auth and secure routing.",
      "Gained experience in backend-frontend data flow.",
      "Improved debugging and API performance handling.",
    ],
    website: "#",
    github: "#",
    techStack: [
      { name: "React", Icon: FaReact, color: "#61DAFB" },
      { name: "Node.js", Icon: FaNodeJs, color: "#3C873A" },
      { name: "Express.js", Icon: SiExpress, color: "#AAAAAA" },
      { name: "MongoDB", Icon: SiMongodb, color: "#4DB33D" },
    ],
  },
  {
    id: 5,
    title: "Code Editor (Web OS App)",
    isComplete: false,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=60",
    description:
      "A browser-based code editor built inside a Windows 11-style web OS interface.",
    fullDescription:
      "Part of my custom Web OS project, this code editor supports HTML, CSS, and JavaScript editing directly in the browser with live preview and syntax highlighting. It mimics real desktop behavior using draggable windows and local storage.",
    keyChallenges: [
      "Implementing draggable and resizable window components.",
      "Rendering live code preview without performance drops.",
      "Maintaining persistent state with local storage.",
    ],
    learnings: [
      "Deepened understanding of DOM manipulation and events.",
      "Improved debugging and state persistence handling.",
      "Enhanced frontend performance optimization techniques.",
    ],
    website: "#",
    github: "#",
    techStack: [
      { name: "JavaScript", Icon: FaJs, color: "#F7DF1E" },
      { name: "HTML", Icon: FaReact, color: "#E44D26" },
      { name: "CSS", Icon: FaCss3Alt, color: "#2965F1" },
    ],
  },
];
