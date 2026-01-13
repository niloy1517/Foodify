import React, { useContext } from 'react'
import Authentication from '../Authentication/Authentication'
import Hero from '../pages/Hero'
import { storeContext } from '../Context/Context'
import RestaurantPartner from '../pages/RestaurantPartner'
import AvailableDistricts from '../pages/AvailableDistricts'
import PopularRestaurantsPage from '../pages/PopularRestaurantsPage'

const Root = () => {
    const {showAuthenticationPopup, setShowAuthenticationPopup} = useContext(storeContext)
    
  return (
    <div>
        <Hero />
        {
            showAuthenticationPopup && 
            <Authentication />
        }
        <PopularRestaurantsPage />
        <RestaurantPartner />
        <AvailableDistricts />
    </div>
  )
}

export default Root