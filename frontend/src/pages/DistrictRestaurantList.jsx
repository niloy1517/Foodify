import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineDeliveryDining } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom'
import { setRestaurantId } from '../Service/Redux/Slice/RestaurantSlice'

const DistrictRestaurantList = () => {

  const [restaurants, setRestaurants] = useState([])
  const [cuisines, setCuisines] = useState([])
  
  const districtId = useSelector((state) => state.district.districtId)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getDistrictRestaurantList = async () => {

    try {
      const response = await axios.get(`http://localhost:5000/api/restaurant/district/${districtId}`)
      setRestaurants(response.data.data)
      setCuisines(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDistrictRestaurantList()
  }, [])

      const handleNavigate = (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        navigate(`/restaurant/${slug}`)
    }

  return (
    <div className='w-full px-8'>
      <div>
        <h1 className='text-4xl font-medium text-gray-800 py-10'>All restaurants</h1>
      </div>
      <div className='w-full flex gap-8 flex-wrap font-medium text-gray-600 mx-auto px-4 cursor-pointer'>
        {
          restaurants.map(restaurant => (
            <div onClick={() => { dispatch(setRestaurantId(restaurant._id)), handleNavigate(restaurant.restaurantName) }} className='w-[300px] border border-gray-200 rounded-2xl overflow-hidden'>
              <img className='w-full h-45  hover:scale-105 transition duration-300' src={`http://localhost:5000/images/${restaurant.image}`} alt={restaurant.name} />
              <div className='flex items-center justify-between'>
                <p className='text-[22px] font-medium py-1 px-2'>{restaurant.restaurantName}</p>
                <div className='flex items-center px-2'>
                  <FaStar className='text-amber-500' />
                  <p>{restaurant.rating}</p>
                  <p className='pl-1'>(3500+)</p>
                </div>
              </div>
              <div className='w-full flex px-2 py-1'>
                <div className='flex-1 flex items-center space-x-1'>

                  <p>{restaurant.deliveryTime} min</p>
                </div>
                <div className="max-w-[180px] pl-2 text-[15px] line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap flex items-center">
                  {
                    JSON.parse(restaurant.cuisines).map((cuisine, index) => (
                      <span key={index} className="flex items-center">
                        <GoDotFill className="text-[8px]" />
                        {cuisine}
                      </span>
                    ))
                  }
                </div>

              </div>
              <div className='flex items-center space-x-1 p-2'>
                <MdOutlineDeliveryDining className='text-[20px]' />
                <p>{restaurant.deliveryFee} tk</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DistrictRestaurantList