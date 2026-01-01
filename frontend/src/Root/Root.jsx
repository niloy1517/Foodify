import React, { useContext } from 'react'
import Authentication from '../Authentication/Authentication'
import Hero from '../pages/Hero'
import { storeContext } from '../Context/Context'
import RestaurantSlider from '../pages/RestaurantSlider'
import RestaurantPartner from '../pages/RestaurantPartner'
import AvailableDistricts from '../pages/AvailableDistricts'

const Root = () => {
    const {showAuthenticationPopup, setShowAuthenticationPopup} = useContext(storeContext)
    
  return (
    <div>
        <Hero />
        {
            showAuthenticationPopup && 
            <Authentication />
        }
        <RestaurantSlider />
        <RestaurantPartner />
        <AvailableDistricts />
    </div>
  )
}

export default Root