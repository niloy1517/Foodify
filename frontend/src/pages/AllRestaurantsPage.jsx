import React from 'react'
import RestaurantCard from '../components/RestaurantCard';
import { useEffect } from 'react';
import { restaurantService } from '../Services/restaurant.service';
import { useState } from 'react';

const AllRestaurantsPage = () => {
    const [ restaurants, setRestaurants ] = useState([])


    const allRestaurants = async () => {
        try {
            const response = await restaurantService.getAll();
            setRestaurants(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        allRestaurants()
    })

    if (!restaurants || restaurants.length === 0) {
        return
    }
    return (
        <div className='w-full'>
            <h1 className='text-3xl font-semibold text-gray-700 py-8'>All restaurants</h1>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-6'>
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