import React from 'react'
import SpotlightCard from './SpotlightCard';
import { NavLink } from 'react-router-dom';
import { BlogData } from '../../../data/BlogData';
const BlogCard = () => {
  return (
   <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
      {/* Loop through all projects */}
      {BlogData.slice(0, 4).map((project, index) => (
        <SpotlightCard
          key={index}
          className="transition-transform duration-300 bg-[var(--color-card-bg)]"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          {/* 📸 Project Image */}
          <img
            src={project.image}
            alt={project.title}
            className="rounded-2xl object-center object-cover mb-3"
          />

          {/* 📦 Card Content */}
          <div className="p-5">
            {/* 🔹 Title + Icons */}
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--color-text)] text-sm font-semibold">
                {project.title}
              </h2>

              
            </div>

            {/* 📝 Description */}
            <span className="text-[var(--color-secondary-text)] text-md mt-1 block">
              {project.description.length > 80
                ? project.description.slice(0, 80) + "..."
                : project.description}
            </span>

            {/* ⚙️ Tech Stack */}
            

            {/* ⚡ System Status + View Details */}
            <div className="flex py-6 items-center justify-between">
              {/* ✅ Active System */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                <h3 className="text-[var(--color-text)] font-medium">
                  {project.status}
                </h3>
              </div>

              {/* 🔗 View Details */}
              <NavLink
                to="/blogs"
                className="flex items-center gap-1 text-[var(--color-accent)] hover:underline transition-all duration-300"
              >
                <h3>Read More</h3>
                <img
                  src="src/assets/technologySvgs/rightArrow.webp"
                  className="w-5 h-5 text-white"
                  alt="arrow"
                />
              </NavLink>
            </div>
          </div>
        </SpotlightCard>
      ))}
     
    </div>
  )
}

export default BlogCard
