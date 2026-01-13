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
  const { findFoodByLocationPopup, setFindFoodByLocationPopup, isOverlay, isDropdownMenu, filters } = useContext(storeContext)

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

  const filterCounter = Object.values(filters).filter(f => f !== '').length;



  return (
    <div className='w-full'>
      <div className='w-full flex'>
        {/* Sidebar */}
        <div className={`hidden xl:flex sticky self-start h-fit top-24  ${isOverlay && '-z-10'} `}>
          <DesktopFilterbar
            setIsFiltered={setIsFiltered}
            setShowFilteredRestaurants={setShowFilteredRestaurants}
          />
        </div>
        {/* Main content */}
        {
          filterCounter === 0 &&
          <div className={`w-full grid grid-cols-1 px-4 md:px-8 xl:px-16 ${isDropdownMenu && '-z-10'} `}>
            <SearchBar
              isFiltered={isFiltered}
            />

            <div className={`mt-14 relative ${isOverlay && '-z-30'}`}>
              <MenuCategory />
              <NewRestaurantsPage />
              <AllRestaurantsPage />
            </div>
          </div>
        }
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




