import React from 'react'

const Introduction = () => {
    return (
        <div className='mx-auto max-w-3xl px-8 py-14'>
            <div>
                <div className='inline-block'>
                    <img
                        className='h-24 w-24 rounded-full transition-all duration-300 ease-in-out bg-yellow-300'
                        src="/src/assets/Logo/logo (1).webp"
                        alt="Logo"
                        loading="lazy"
                    />
                </div>

                <div className='text-center py-8'>
                    <span className='text-[34px] font-bold   text-[var(--color-text)]  '>
                        Hi, I'm Meghraj
                        <span className='px-2'>
                             — 
                        </span>
                        <span className='text-[var(--color-secondary-text)]'>
                           I Make Softwares For Web.
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Introduction
