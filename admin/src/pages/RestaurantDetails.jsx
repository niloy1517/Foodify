import React, { useContext } from 'react'
import { storeContext } from '../Context/RestaurantContext'
import { FaRegStar } from "react-icons/fa6";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import { RiRestaurantFill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";


import axios from 'axios'
import { useEffect } from 'react';

import { useState } from 'react';

import Overview from './Overview';
import Menu from './Menu';
import { useDispatch, useSelector } from 'react-redux';
import { setRestaurantData } from '../Services/Redux/Slices/restaurantSlice';
import { useNavigate } from 'react-router-dom';


const RestaurantDetails = () => {
  axios.defaults.withCredentials = true;

  const { locateLocation, restaurantData, setRestaurantData } = useContext(storeContext)
  const [cuisinesArray, setCuisinesArray] = useState([])
  const [OverviewBtn, setOverviewBtn] = useState('')
  const [menuBtn, setMenuBtn] = useState('active')
  const [orderBtn, setOrderBtn] = useState('')
  const [settingsBtn, setSettingsBtn] = useState('')

  const restaurantId = useSelector((state) => state.restaurant.restaurantId)


  const navigate = useNavigate()

  const getRestaurantData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/restaurant/details/${restaurantId}`, { withCredentials: true })
      setRestaurantData(response.data.data)
      if (response.data.data) {
        setCuisinesArray(JSON.parse(response.data.data.cuisines))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (restaurantId) {
      getRestaurantData()
    }
  }, [])

  return (
    <div className='w-full h-[90vh] overflow-y-auto py-10 px-6'>
      <p className='text-3xl font-medium text-gray-700 border-b border-gray-200 pb-1'>Restaurant Details</p>
      <div className='mt-8 flex flex-col gap-20'>
        <div className='w-[400px] flex flex-col shadow'>
          <img className='w-[94%] flex pt-2 mx-auto' src={`http://localhost:5000/images/${restaurantData.image}`} alt="" />
          <div className='px-4 py-2'>
            <div className=''>
              <p className='text-[28px] font-medium text-gray-700 pb-2'>{restaurantData.restaurantName}</p>
              <div className='flex items-center justify-between'>
                <p className='flex items-center gap-1 bg-amber-500 text-white px-3 py-0.5 font-medium rounded-[20px]'><FaRegStar /> 4.5</p>
                <p className='px-3 py-0.5 bg-green-400 text-white rounded-[20px] font-medium'>{restaurantData.status}</p>
              </div>
            </div>
            <div className='flex flex-wrap gap-2 mt-4 text-gray-700'>
              {
                cuisinesArray.map(cuisine => (
                  <p key={cuisine._id} className='bg-gray-200 px-3 py-0.5 rounded-[20px]'>{cuisine}</p>
                ))
              }
            </div>
            <p className='text-gray-700 py-4 text-[17px] font-sans'>{restaurantData.description}</p>
          </div>
        </div>
        <div className='flex gap-8 text-[18px] font-medium'>
          <button onClick={() => navigate('/restaurant/update')} className='flex items-center gap-1 cursor-pointer px-6 py-2.5 rounded text-white bg-blue-500 hover:bg-blue-600'><FiEdit className='text-2xl' /> <span>Edit Restaurant</span></button>
          <button onClick={() => navigate('/food/add')} className='flex items-center gap-1 cursor-pointer px-6 py-2.5 rounded text-white bg-orange-500 hover:bg-orange-600'><RiRestaurantFill className='text-2xl' /> <span>Manage Menu</span></button>
          <button className='flex items-center gap-1 cursor-pointer px-6 py-2.5 rounded text-white bg-green-500 hover:bg-green-600'><TbBrandGoogleAnalytics className='text-2xl' /> <span>View Analytics</span></button>
          <button className='flex items-center gap-1 cursor-pointer px-6 py-2.5 rounded text-white bg-pink-500 hover:bg-pink-600'><IoMdNotifications className='text-2xl' /> <span>Notifications</span></button>
        </div>
        <div className='flex gap-8 flex-wrap text-[18px] font-medium text-gray-700'>
          <div className='w-60 h-40 bg-white rounded-[10px] flex flex-col items-center justify-center shadow hover:mt-[-10px] transition-normal duration-300 ease-in'>
            <p className='text-4xl font-medium text-pink-600'>124</p>
            <p>Total orders</p>
          </div>
          <div className='w-60 h-40 bg-white rounded-[10px] flex flex-col items-center justify-center shadow hover:mt-[-10px] transition-normal duration-300 ease-in'>
            <p className='text-4xl font-medium text-green-600'>50,000</p>
            <p>Total Revenue</p>
          </div>
          <div className='w-60 h-40 bg-white rounded-[10px] flex flex-col items-center justify-center shadow hover:mt-[-10px] transition-normal duration-300 ease-in'>
            <p className='text-4xl font-medium text-amber-600'>4.5</p>
            <p>Average Rating</p>
          </div>
          <div className='w-60 h-40 bg-white -[10px] flex flex-col items-center justify-center shadow hover:mt-[-10px] transition-normal duration-300 ease-in'>
            <p className='text-4xl font-medium text-sky-600'>87%</p>
            <p>Completion Rate</p>
          </div>
        </div>
        <div className='flex gap-10 text-[20px] font-medium text-gray-700 border-b border-gray-200 pb-2'>
          <button className='px-4 cursor-pointer '>Overview</button>
          <button className='px-4 cursor-pointer '>Menu</button>
          <button className='px-4 cursor-pointer '>Orders</button>
          <button className='px-4 cursor-pointer '>Settings</button>
        </div>
        <div className=''>
          {
            OverviewBtn === 'active' &&
            <Overview />
          }
          {
            menuBtn === 'active' &&
            <Menu />
          }
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetails