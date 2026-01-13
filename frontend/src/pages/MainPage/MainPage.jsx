import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar'
import MenuCategory from '../MenuCategory'
import { useContext } from 'react'
import { storeContext } from '../../Context/Context'
import MobileFilterbarModal from '../Filterbar/MobileFilterbarModal'
import AllRestaurantsPage from '../AllRestaurantsPage'
import NewRestaurantsPage from '../NewRestaurantsPage'
import FindFoodByLocation from '../FindFoodByLocation'
import { useLocationRestaurants } from '../../Hooks/useLocationRestaurants'
import DesktopFilterbar from '../Filterbar/DesktopFilterbar'



const MainPage = () => {
  const { findFoodByLocationPopup, setFindFoodByLocationPopup, isOverlay } = useContext(storeContext)

  const [showFilteredRestaurants, setShowFilteredRestaurants] = useState(false)
  // const [showFilteredRestaurant, setShowFilteredRestaurant] = useState(false)
  const { isMobileFilterbarModal } = useContext(storeContext)

  const { setFullAddressData, setCoordinates } = useLocationRestaurants()

  useEffect(() => {
    // store user location from localStorage
    const userLocation = JSON.parse(localStorage.getItem('defaultLocation'))
    if (!userLocation) return;
    setFullAddressData(userLocation)
  }, [])


  const [isFiltered, setIsFiltered] = useState(false);

  const [hideFilterbar, setHideFilterbar] = useState(true);


  return (
    <div className='w-full'>
      <div className='w-full flex'>
        {/* Sidebar */}
        <div className={`hidden xl:flex sticky self-start h-fit top-24  ${isOverlay && '-z-10'} `}>
          <DesktopFilterbar
            setShowFilteredRestaurants={setShowFilteredRestaurants}
          />
        </div>
        {/* Main content */}
        <div className='w-full grid grid-cols-1 px-8 xl:px-16 '>
          <SearchBar
            isFiltered={isFiltered}
          />

          <div className={`mt-14 relative ${isOverlay && '-z-30'}`}>
            <MenuCategory />
            <NewRestaurantsPage />
            <AllRestaurantsPage />
          </div>
        </div>
      </div>




      {
        findFoodByLocationPopup &&
        <div onClick={() => setFindFoodByLocationPopup(false)} className='w-full h-[100vh] top-0 flex justify-center items-center fixed bg-black/50 z-20'>
          <FindFoodByLocation />
        </div>
      }

      {/* Mobile filterbar modal */}
      {
        isMobileFilterbarModal &&
        <MobileFilterbarModal
          setShowFilteredRestaurants={setShowFilteredRestaurants}
          setIsFiltered={setIsFiltered}
        />
      }
    </div>
  )
}

export default MainPage




