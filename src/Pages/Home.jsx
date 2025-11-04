import React from 'react'
import Transition from './../transition/Transition';
import Introduction from './../components/Ui/Layouts/Introduction';
import HomeProjects from '../components/Ui/Layouts/HomeProjects';
import HomeAbout from '../components/Ui/Layouts/HomeAbout';


const Home = () => {
  return (
    <div className=' max-w-3xl m-auto px-8'>
      <Introduction />
      <HomeProjects />
      <HomeAbout/>
    </div>
  )
}

export default Transition(Home)
