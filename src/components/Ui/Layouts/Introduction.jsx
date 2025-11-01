import React from 'react'

const Introduction = () => {
    return (
        <div className='mx-auto max-w-3xl px-8 py-10'>
            <div>
                <div className='inline-block'>
                    <img
                        className='h-24 w-24 rounded-full transition-all duration-300 ease-in-out bg-yellow-300'
                        src="/src/assets/Logo/logo (1).webp"
                        alt="Logo"
                        loading="lazy"
                    />
                </div>

                <div className='text-center'>
                    <h1 className='text-[36px] font-bold py-8 text-[var(--color-text)]  '>
                        Hi, I'm Meghraj
                        <span className='text-[var(--color-secondary-text)]'>
                            — I Make Softwares For Web.
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Introduction
