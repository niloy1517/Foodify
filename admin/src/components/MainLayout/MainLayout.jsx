import React from 'react'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='w-full flex h-[100vh] fixed'>
        <div>
          <Sidebar />
        </div>
        <div className='w-full'>
          <Navbar />
          <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout