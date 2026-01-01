import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineLibraryAdd } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

import RestaurantList from './RestaurantList';




const Restaurant = () => {
  const navigate = useNavigate()

  return (
    <div className='w-full h-[90vh] overflow-y-auto'>
      <div className='w-full bg-[#F9FAFB]'>
        <div className=' px-6 pt-6'>
          <h1 className='font-medium text-2xl'>Restaurants</h1>
        </div>
        <div className='w-[90%] h-[80%] border border-gray-300 flex flex-col mx-auto my-10 bg-white'>
          <div className='flex justify-between items-center px-4 py-4 border-b border-gray-300'>
            <div>
              <p className='text-[22px] font-medium'>Restaurant List</p>
              <p>All verified restaurant is here.</p>
            </div>
            <button onClick={() => navigate('/add/restaurant')} className='flex items-center gap-2 bg-orange-600 text-white p-3 rounded'>
              <MdOutlineLibraryAdd className='text-3xl' />
              <p className='text-[18px]'>Add restaurant</p>
            </button>
          </div>
          <div className='h-20 flex items-center justify-between px-6 border-b border-gray-300'>
            <div className='w-90 h-12 flex items-center text-[18px] border border-gray-200 rounded-[8px] px-3 shadow-md'>
              <IoSearchOutline className='text-[34px] font-medium cursor-pointer text-gray-500' />
              <input className='outline-0 w-full h-full px-3' type="text" placeholder='Search restaurant...' />
            </div>
            <div className='flex gap-1 items-center bg-gray-700 text-white cursor-pointer px-4 py-2'>
              <MdOutlineLibraryAdd />
              <p>Filter</p>
            </div>
          </div>
        </div>
        <RestaurantList />
      </div>
    </div>
  )
}

export default Restaurant