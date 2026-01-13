import React, { useContext } from 'react'
import Footer from '../components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import { storeContext } from '../Context/Context'


const MainLayout = () => {
  const { isOverlay, setIsOverlay } = useContext(storeContext)
  const location = useLocation()

  const isCheckout = location.pathname === '/checkout'

  return (
    <div className='relative'>
      <Navbar />
      <div onClick={() => setIsOverlay(false)} className={`max-w-[1400px] mx-auto ${isOverlay ? 'w-full bg-black/80 z-100 ' : ''}`}>

        <Outlet />
        {
          isCheckout ?
            <div className='hidden lg:block'>
              <Footer />
            </div> : <Footer />
        }

      </div>
    </div>
  )
}

export default MainLayout