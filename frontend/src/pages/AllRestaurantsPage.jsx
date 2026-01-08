import React, { useContext } from 'react'
import RestaurantCard from '../components/RestaurantCard';
import { storeContext } from '../Context/Context';

const AllRestaurantsPage = () => {
    const { restaurants } = useContext(storeContext)


    if (!restaurants || restaurants.length === 0) {
        return <p className='text-center text-2xl text-gray-700 mt-20'>No restauant found</p>
    }
    return (
        <div className='w-full'>
            <h1 className='text-3xl font-semibold text-gray-700 py-8'>All restaurants</h1>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-6'>
                {
                    restaurants.map(restaurant => (
                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                    ))
                }
            </div>
        </div>
    )
}

export default AllRestaurantsPage