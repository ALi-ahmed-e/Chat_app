import React from 'react'
import Chat from './Chat'
import SideMenu from './SideMenu'

const Home = () => {


  
  return (
    <div className='flex text-white'>
      <SideMenu />
      <Chat/>
    </div>
  )
}

export default Home