import React from 'react'
import Cards from './Cards'
import BlogCard from './BlogCard'
import { NavLink } from 'react-router-dom';

const HomeBlog = () => {
    return (
        <div className='mt-6'>
            <div className="flex flex-col gap-0.5">
                <h3>Featured</h3>
                <h2>Blogs</h2>
            </div>

            <BlogCard />

            {/* 🔹 Centered Button with NavLink */}
            <div className="flex justify-center py-6">
                <NavLink
                    to="/blogs"
                    className="relative text-sm border-none font-semibold cursor-pointer rounded-lg 
                     z-[1] bg-transparent group transition-all duration-[500ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
                >
                    <div
                        className="flex items-center justify-between gap-2 min-h-[40px] px-6 rounded-md 
                        shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]
                        transition-all duration-[200ms] ease-[cubic-bezier(0.77,0,0.175,1)] 
                        hover:shadow-[inset_0_0_8px_var(--color-secondary-text)]"
                        style={{
                            backgroundColor: "var(--color-card-bg)",
                            color: "var(--color-text)",
                            fontFamily: "var(--font-main)",
                        }}
                    >
                        
                        Show All Blogs
                    </div>
                </NavLink>
            </div>
        </div>
    )
}

export default HomeBlog
