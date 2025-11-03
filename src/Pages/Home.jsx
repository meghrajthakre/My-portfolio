import React from 'react'
import Transition from './../transition/Transition';
import Introduction from './../components/Ui/Layouts/Introduction';


const Home = () => {
  return (
    <div className=' max-w-3xl m-auto  z-30'>
     <Introduction/>
    </div>
  )
}

export default Transition(Home)
