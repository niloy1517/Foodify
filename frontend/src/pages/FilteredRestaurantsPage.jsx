import React, { useContext } from 'react'
import { storeContext } from '../Context/Context'
import RestaurantCard from '../components/RestaurantCard'
import SearchBar from './SearchBar'
import MobileFilterbarModal from './Filterbar/MobileFilterbarModal'

const FilteredRestaurantsPage = () => {
    const { restaurants, isOverlay, isMobileFilterbarModal } = useContext(storeContext)


    return (
        <div className='w-full px-4 md:px-10 xl:px-15'>
            <div className='w-full'>
                <SearchBar />
            </div>
            <div className={`w-full relative ${isOverlay && '-z-10'} mt-8`}>
                <p className='text-3xl font-semibold text-gray-700 mb-10'>{restaurants.length !== 0 ? restaurants.length : 'No' } Restaurants found</p>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-6'>
                    {
                        restaurants.map(restaurant => (
                            <RestaurantCard key={restaurant._id} restaurant={restaurant} from='filteredRestaurantsPageJsx' />
                        ))
                    }
                </div>
            </div>
            {
                isMobileFilterbarModal &&
                <MobileFilterbarModal />
            }
        </div>
    )
}

export default FilteredRestaurantsPage