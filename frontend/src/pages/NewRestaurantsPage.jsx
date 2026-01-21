import React from 'react'
import SwiperSlider from '../components/SwiperSlider'
import { useState } from 'react';
import { useEffect } from 'react';
import { restaurantService } from '../Services/restaurant.service';



const NewRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([])

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
    return ;
  }

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-semibold text-gray-700 py-8'>New on Foodify</h1>
      <SwiperSlider restaurants={[...restaurants].reverse().slice(0, 20)} />
    </div>
  )
}

export default NewRestaurantsPage