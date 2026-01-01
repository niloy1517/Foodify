import React from 'react'
import { assets } from '../assets/assets'

const RestaurantPartner = () => {
  return (
    <div className='w-full relative mb-70 mt-20'>
        <img className='w-full md:h-[50vh] lg:h-[60vh] object-cover' src={assets.restaurant_shape} alt="" />
        <div className='w-[80%] md:w-[50%] lg:w-[40%] shadow-2xl mx-6 md:mx-15 bg-white mt-[-60px] rounded-[5px] absolute text-gray-800'>
            <h1 className='text-[20px] font-medium py-2 px-3 md:py-6 md:px-6'>Partner With Us</h1>
            <p className='px-3 md:px-6'>Join our growing network of restaurants and reach thousands of hungry customers every day. Let us help you grow your business with powerful tools and seamless delivery support.</p>
            <p className='px-3 md:px-6 pt-2 md:pt-4'>Complete the registration form to begin your partnership journey.</p>
            <button className='px-3 py-1 md:py-2 bg-orange-600 text-white font-medium cursor-pointer rounded-[7px] mx-3 md:mx-6 my-3 md:my-8'>Grow With Us</button>
        </div>
    </div>
  )
}

export default RestaurantPartner