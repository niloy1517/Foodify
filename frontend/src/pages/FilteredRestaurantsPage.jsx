import React, { useContext } from 'react'
import { storeContext } from '../Context/Context'
import RestaurantCard from '../components/RestaurantCard'
import SearchBar from './SearchBar'

const FilteredRestaurantsPage = () => {
    const { restaurants, isOverlay } = useContext(storeContext)


    return (
        <div className='w-full px-8'>
            <div className='w-full xl:w-[70%]'>
                <SearchBar />
            </div>
            <div className={`w-full relative ${isOverlay && '-z-10'} mt-8`}>
                <p className='text-3xl font-semibold text-gray-700 mb-10'>{restaurants.length !== 0 ? restaurants.length : 'No' } Restaurants found</p>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-6'>
                    {
                        restaurants.map(restaurant => (
                            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default FilteredRestaurantsPage