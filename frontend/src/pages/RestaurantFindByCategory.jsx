import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IoMdTime } from "react-icons/io"
import { MdOutlineDeliveryDining } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { setRestaurantId } from '../Service/Redux/Slice/RestaurantSlice'

const RestaurantFindByCategory = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [restaurants, setRestaurants] = useState([])

  const userData = useSelector((state) => state.user.userData)

 

  const handleNavigate = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    navigate(`/restaurant/${slug}`)
    console.log(name)
  }

  
  

  const getRestaurants = async () => {
    const userLat = userData?.address[0]?.location?.coordinates[1]
    const userLng = userData?.address[0]?.location?.coordinates[0]
    const query = new URLSearchParams({
      categoryId: id,
      lat: userLat,
      lng: userLng
    })
    try {
      const response = await axios.get(`http://localhost:5000/api/restaurant/search?${query.toString()}`)
      setRestaurants(response.data.data)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRestaurants()
  }, [])
  return (
    <div className='w-full p-10'>
      <h1 className='text-3xl font-semibold text-gray-700 mb-10'>{restaurants?.length > 0 ? `${restaurants?.length} Restaurants found` : 'Restaurants Not Found'}</h1>
      <div className=' mx-auto grid grid-cols-4 gap-8'>
        {
          restaurants?.map(restaurant => (
            <div onClick={() => { dispatch(setRestaurantId(restaurant._id)), handleNavigate(restaurant.restaurantName) }} key={restaurant._id} className='w-78 h-66 shrink-0 bg-gray-50 border border-gray-300 rounded-2xl overflow-hidden cursor-pointer'>
              <img className='w-full h-42 hover:max-h-42 hover:scale-105 transition transform duration-400' src={`http://localhost:5000/images/${restaurant.image}`} alt={restaurant.restaurantName} />
              <div className='flex justify-between'>
                <p className='text-[22px] text-gray-800 font-medium py-1 px-2'>{restaurant.restaurantName}</p>
                <div className='flex items-center space-x-1 px-2'>
                  <FaStar className='text-amber-500' />
                  <p>{restaurant.rating}</p>
                  <p className='pl-1 text-[14px]'>(3500+)</p>
                </div>
              </div>
              <div>
                {restaurant.cuisines.map(cuisine => (
                  <span>{cuisine}</span>
                ))}
              </div>
              <div className='flex space-x-10 px-2 py-1'>
                <div className='flex items-center space-x-1'>
                  <IoMdTime />
                  <p>{restaurant.deliveryTime}</p>
                </div>
                <div className='flex items-center space-x-1'>
                  <MdOutlineDeliveryDining className='text-[20px]' />
                  <p>{restaurant.deliveryFee}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default RestaurantFindByCategory