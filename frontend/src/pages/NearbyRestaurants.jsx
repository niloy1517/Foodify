import React from 'react'
import RestaurantCard from '../components/RestaurantCard'
import { restaurantService } from '../Services/restaurant.service'
import { useEffect } from 'react'
import { useState } from 'react'

const NearbyRestaurants = () => {
    const [restaurants, setRestaurants] = useState([])

    const userLocation = JSON.parse(localStorage.getItem('defaultLocation'))
    
    const getNearybyRestaurants = async () => {
        try {
            if (!userLocation?.lat || !userLocation?.lon) return;
            const response = await restaurantService.getNearBy({ lat: userLocation?.lat, lng: userLocation?.lon });
            setRestaurants(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getNearybyRestaurants()
    }, [userLocation.lat])

    if(!restaurants || restaurants.length === 0) {
        return;
    }
    return (
        <div className='w-full'>
            <h1 className='text-3xl font-semibold text-gray-700 py-8'>Nearby restaurants</h1>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-6'>
                {
                    restaurants?.map(restaurant => (
                        <RestaurantCard key={restaurant._id} restaurant={restaurant} canDeliver={restaurant.canDeliver} />
                    ))
                }
            </div>
        </div>
    )
}

export default NearbyRestaurants