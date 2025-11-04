import React from 'react'

const HomeAbout = () => {
    return (
        <div className="mt-10">
            {/* 🔹 Heading */}
            <div className="flex flex-col gap-0.5">
                <h3>About</h3>
                <h2>Me</h2>
            </div>

            <div className="py-6">
                <div
                    className="size-60 rounded-md"
                    style={{ backgroundColor: "var(--logo-bg)" }}
                >
                    <img src="src/assets/Logo/logo (1).webp" alt="" />
                </div>
            </div>




        </div>
    )
}

export default HomeAbout
