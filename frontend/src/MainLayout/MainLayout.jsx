import React from 'react'
import Footer from '../components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'


const MainLayout = () => {
  const location = useLocation()
  console.log(location)
  const isCheckout = location.pathname === '/checkout'
  console.log(isCheckout)
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