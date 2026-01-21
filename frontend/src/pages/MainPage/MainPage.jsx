import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar'
import MenuCategory from '../MenuCategory'
import { useContext } from 'react'
import { storeContext } from '../../Context/Context'
import MobileFilterbarModal from '../Filterbar/MobileFilterbarModal'
import AllRestaurantsPage from '../AllRestaurantsPage'
import NewRestaurantsPage from '../NewRestaurantsPage'
import FindFoodByLocation from '../FindFoodByLocation'
import DesktopFilterbar from '../Filterbar/DesktopFilterbar'
import FilteredRestaurantsPage from '../FilteredRestaurantsPage'
import NearbyRestaurants from '../NearbyRestaurants'
import { useOrderManager } from '../../Hooks/useOrderManager'
import { useSelector } from 'react-redux'

const MainPage = () => {
  const { findFoodByLocationPopup, setFindFoodByLocationPopup, isOverlay, isDropdownMenu, filters, isMobileFilterbarModal } = useContext(storeContext)

  const { getOrderData } = useOrderManager()

  const userData = useSelector((state) => state.user.userData);


  const [showFilteredRestaurants, setShowFilteredRestaurants] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false);
  const [hideDesktopFilterbar, setHideDesktopFilterbar] = useState(false);
  const [hideMainContent, setHideMainContent] = useState(false)
  const filterCounter = Object.values(filters).filter(f => f !== '').length;

  useEffect(() => {
    if (userData?._id) {
      getOrderData();
    }
  }, [userData?._id]);

  return (
    <div className='w-full min-h-screen h-auto'>
      <div className='w-full flex'>
        {/* Sidebar */}
        {
          !hideDesktopFilterbar &&
          <div className={`hidden xl:flex sticky self-start h-fit top-24  ${isOverlay && '-z-10'} `}>
            <DesktopFilterbar
              setShowFilteredRestaurants={setShowFilteredRestaurants}
              setIsFiltered={setIsFiltered}
            />
          </div>
        }
        {/* Main content */}
        {
          filterCounter === 0 ?
            <div className={`w-full grid grid-cols-1  ${isDropdownMenu && '-z-10'} `}>
              <SearchBar
                setIsFiltered={setIsFiltered}
                setHideDesktopFilterbar={setHideDesktopFilterbar}
                setHideMainContent={setHideMainContent}
              />

              {
                !hideMainContent ?
                  <div className={`mt-14 relative px-4 md:px-8 xl:px-16 ${isOverlay && '-z-30'}`}>
                    <MenuCategory />
                    <NewRestaurantsPage />
                    <NearbyRestaurants />
                    <AllRestaurantsPage />
                  </div>
                  :
                  <div className='px-0'>
                    <FilteredRestaurantsPage />
                  </div>
              }
            </div>
            :
            <FilteredRestaurantsPage />
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




