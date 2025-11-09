import React from "react";
import { useParams } from "react-router-dom";
import { ProjectsData } from "../data/ProjectsData";
import { FaGithub } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";

const ProjectDetail = () => {
  const { id } = useParams();
  const project = ProjectsData.find((p) => p.id === Number(id));

  if (!project) return <h2 className="text-center mt-10">Project not found 😕</h2>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-80 object-cover rounded-2xl"
      />

      <h1 className="text-3xl font-bold mt-6">{project.title}</h1>
      <p className="text-gray-400 mt-3">{project.description}</p>

      <div className="flex gap-4 mt-5">
        <a href={project.website} target="_blank" rel="noopener noreferrer">
          <FaEarthAmericas className="text-2xl hover:text-blue-400 transition" />
        </a>
        <a href={project.github} target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-2xl hover:text-blue-400 transition" />
        </a>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-xl">Technologies Used:</h3>
        <div className="flex gap-4 mt-3">
          {project.techStack.map((tech) => {
            const TechIcon = tech.Icon;
            return (
              <div key={tech.name} className="flex flex-col items-center">
                <TechIcon className="text-3xl" style={{ color: tech.color }} />
                <span className="text-sm">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
