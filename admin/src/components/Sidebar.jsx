import React from 'react'
import { useNavigate } from 'react-router-dom';
import { SiIfood } from "react-icons/si";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineRestaurant } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";

const Sidebar = () => {
  const navigate = useNavigate()
  return (
    <div className='w-70 h-[100vh] border-r border-gray-300'>
        <div className='flex space-x-1.5 font-bold text-4xl py-6 px-6 text-orange-600'>
          <SiIfood />
          <p>Foodify.</p>
        </div>
        <div className='mx-6 mt-6 flex flex-col gap-4 text-gray-700'>
          <button className='w-full flex space-x-4 items-center px-4 py-2 border cursor-pointer'>
            <RxDashboard className='font-medium text-[24px]' />
            <p className='text-[20px] font-medium'>Dashboard</p>
          </button>
          <button onClick={() => navigate('/restaurant')} className='w-full flex space-x-4 items-center px-4 py-2 border cursor-pointer'>
            <MdOutlineRestaurant className='font-medium text-[24px]' />
            <p className='text-[20px] font-medium'>Restaurant</p>
          </button>
          <button onClick={() => navigate('/categories')} className='w-full flex space-x-4 items-center px-4 py-2 border cursor-pointer'>
            <RxDashboard className='font-medium text-[24px]' />
            <p className='text-[20px] font-medium'>Categories</p>
          </button>
          <button onClick={() => navigate('/orders')} className='w-full flex space-x-4 items-center px-4 py-2 border cursor-pointer'>
            <IoFastFoodOutline className='font-medium text-[24px]' />
            <p className='text-[20px] font-medium'>Orders</p>
          </button>
          <button onClick={() => navigate('/district')} className='w-full flex space-x-4 items-center px-4 py-2 border cursor-pointer'>
            <IoFastFoodOutline className='font-medium text-[24px]' />
            <p className='text-[20px] font-medium'>District</p>
          </button>
        </div>
    </div>
  )
}

export default Sidebar