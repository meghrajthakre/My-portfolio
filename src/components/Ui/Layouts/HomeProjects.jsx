import React from 'react'
import Cards from './Cards'

const HomeProjects = () => {
    return (
        <div className='mt-5 '>
            <div className='flex flex-col -gap-0.5'>
                <h3 >Featured</h3>
                <h2>Projects</h2>
            </div>

            <Cards/>
        </div>
    )
}

export default HomeProjects
