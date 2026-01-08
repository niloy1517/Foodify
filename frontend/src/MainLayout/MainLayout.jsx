import React from 'react'
import Footer from '../components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'


const MainLayout = () => {
  const location = useLocation()

  const isCheckout = location.pathname === '/checkout'

  return (
    <div>
      <Navbar />
      <Outlet />
      {
        isCheckout ?
          <div className='hidden lg:block'>
            <Footer />
          </div> : <Footer />
      }
    </div>
  )
}

export default MainLayout