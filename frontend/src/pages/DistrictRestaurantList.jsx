import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineDeliveryDining } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom'
import { setRestaurantId } from '../Service/Redux/Slice/RestaurantSlice'
import { storeContext } from '../Context/Context'
import { axiosInstance } from '../Api/axiosInstance'
import RestaurantCard from '../components/RestaurantCard'

const DistrictRestaurantList = () => {

  const { restaurants } = useContext(storeContext)
  const [restaurantList, setRestaurantList] = useState([])

  const districtId = useSelector((state) => state.district.districtId)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getDistrictRestaurantList = async () => {
    try {
      const response = await axiosInstance.get(`/restaurant/district/${districtId}`)
      setRestaurantList(response.data.data)

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
    <div className='w-full px-4 md:px-6 lg:px-10 xl:px-15'>
      <h1 className='text-3xl font-semibold text-gray-700 py-8'>{restaurantList.length > 0 ? `${restaurantList.length} Restaurants found` : 'No restaurant found'}</h1>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto gap-6'>
        {
          restaurantList.map(restaurant => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant}  />
          ))
        }
      </div>
    </div>
  )
}

export default DistrictRestaurantList