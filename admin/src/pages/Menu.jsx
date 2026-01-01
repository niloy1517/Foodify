import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { RiRestaurantFill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import RestaurantFoodList from './RestaurantFoodList';

const Menu = () => {

  return (
    <div className='shadow py-6 px-6'>
        <div className='flex justify-between border-b border-gray-200 pb-2'>
            <p className='flex items-center gap-1 text-2xl font-medium text-gray-700'><RiRestaurantFill className='text-3xl text-orange-600'/> Menu Item</p>
            <button className='flex items-center gap-1 cursor-pointer bg-orange-600 px-4 py-1.5 rounded text-white font-medium text-[18px]'><FiPlus className='text-2xl' /> Add Item</button>
        </div>
        <RestaurantFoodList />
    </div>
  )
}

export default Menu