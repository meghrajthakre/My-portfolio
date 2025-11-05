import React from 'react'
import Transition from './../transition/Transition';
import Introduction from './../components/Ui/Layouts/Introduction';
import HomeProjects from '../components/Ui/Layouts/HomeProjects';
import HomeAbout from '../components/Ui/Layouts/HomeAbout';
import HomeGitHub from '../components/Ui/Layouts/HomeGitHub';
import HomeBlog from '../components/Ui/Layouts/HomeBlog';


const Home = () => {
  return (
    <div className=' max-w-3xl m-auto px-8'>
      <Introduction />
      <HomeProjects />
      <HomeAbout/>
      <HomeGitHub/>
      <HomeBlog/>
    </div>
  )
}

export default Transition(Home)
