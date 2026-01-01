import React, { useState } from 'react'
import FilterBar from '../FilterBar'
import AllRestaurantsListByLocation from '../AllRestaurantsListByLocation'
import SearchBar from '../SearchBar'
import MenuCategory from '../MenuCategory'
import NewRestaurantListByLocation from '../NewRestaurantListByLocation'
import FilteredRestaurants from '../FilteredRestaurants'



const MainPage = () => {
  const [showCateRestaurants, setShowCateRestaurants] = useState(false)
  const [showFilteredRestaurant, setShowFilteredRestaurant] = useState(false)


  return (
    <div className='w-full flex'>
      {/* Sidebar */}
      <div className='hidden xl:flex sticky self-start h-fit top-[16%] left-0 w-64'>
        <FilterBar
          setShowFilteredRestaurant={setShowFilteredRestaurant}
        />
      </div>
      

      {/* Main content */}
      <div className='mx-auto flex flex-col gap-15 px-4 w-[98%] xl:w-[78%]'>
        <SearchBar
          setShowFilteredRestaurant={setShowFilteredRestaurant}
        />
        {
          showFilteredRestaurant ?
            <FilteredRestaurants />
            :
            <div>
              <MenuCategory
                setShowCateRestaurants={setShowCateRestaurants}
                setShowFilteredRestaurant={setShowFilteredRestaurant}

              />
              <NewRestaurantListByLocation />
              <AllRestaurantsListByLocation />
            </div>
        }
        <div className='h-20'></div>
      </div>
    </div>
  )
}

export default MainPage




