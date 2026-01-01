import React from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa6";

const Navbar = () => {
  return (
    <div className='w-full h-[10vh] border-b border-gray-300 flex items-center justify-between'>
        <div className='w-full h-full flex items-center gap-24 mx-14'>
          <div className='w-120 h-12 flex items-center text-[18px] border border-gray-200 rounded-[8px] px-3 shadow-md'>
            <IoSearchOutline className='text-[34px] font-medium cursor-pointer text-gray-500' />
            <input className='outline-0 w-full h-full px-3' type="text" placeholder='Search here...' />
          </div>
          <div className='flex items-center space-x-10'>
            <div className='flex space-x-[-2px] w-11 h-11 rounded-full justify-center shadow-md border border-gray-200 '>
              <button className='font-medium text-[30px] cursor-pointer ml-1'><IoNotificationsOutline className='text-gray-800' /></button>
              <div className='w-2.5 h-2.5 rounded-full bg-orange-600'></div>
            </div>
            <button className='w-11 h-11 shadow-md flex items-center justify-center rounded-full border border-gray-200 text-[30px] cursor-pointer'><CiDark className='font-bold' /></button>
            <div className='flex items-center space-x-3'>
              <img className='w-12 h-12 rounded-full' src='/public/man.png' alt="" />
              <p className='font-medium text-[17px] flex items-center gap-1.5'> <FaAngleDown className='cursor-pointer' /></p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Navbar