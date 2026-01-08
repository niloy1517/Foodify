import React, { useEffect, useState } from 'react'
import FilterBar from '../Filterbar/DesktopFilterbar'
import SearchBar from '../SearchBar'
import MenuCategory from '../MenuCategory'
import { useContext } from 'react'
import { storeContext } from '../../Context/Context'
import MobileFilterbarModal from '../Filterbar/MobileFilterbarModal'
import AllRestaurantsPage from '../AllRestaurantsPage'
import NewRestaurantsPage from '../NewRestaurantsPage'
import FindFoodByLocation from '../FindFoodByLocation'
import { useLocationRestaurants } from '../../Hooks/useLocationRestaurants'



const MainPage = () => {
  const { findFoodByLocationPopup, setFindFoodByLocationPopup } = useContext(storeContext)

  const [showCateRestaurants, setShowCateRestaurants] = useState(false)
  // const [showFilteredRestaurant, setShowFilteredRestaurant] = useState(false)
  const { isMobileFilterbarModal } = useContext(storeContext)

  const {setFullAddressData, setCoordinates} = useLocationRestaurants()

  useEffect(() => {
    // store user location from localStorage
    const userLocation = JSON.parse(localStorage.getItem('defaultLocation'))
    if (!userLocation) return;
    setFullAddressData(userLocation)
  }, [])

  return (
    <div className='w-full flex'>
      {/* Sidebar */}
      <div className='hidden xl:flex sticky self-start h-fit top-[16%] left-0 w-64'>
        <FilterBar />
      </div>

      {
        findFoodByLocationPopup &&
        <div onClick={() => setFindFoodByLocationPopup(false)} className='w-full h-[100vh] top-0 flex justify-center items-center fixed bg-black/50 z-20'>
          <FindFoodByLocation />
        </div>
      }

      {/* Main content */}
      <div className='mx-auto flex flex-col gap-15 px-4 w-[98%] xl:w-[78%]'>
        <SearchBar />

        <MenuCategory />

        <NewRestaurantsPage />

        <AllRestaurantsPage />

        <div className='h-20'></div>

        {/* Mobile filterbar modal */}
        {
          isMobileFilterbarModal &&
          <MobileFilterbarModal />
        }
      </div>
    </div>
  )
}

export default MainPage




