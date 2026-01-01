import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { storeContext } from '../Context/RestaurantContext'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setRestaurantId, setRestaurants } from '../Services/Redux/Slices/restaurantSlice'
import { FaRegEdit } from 'react-icons/fa'
import { MdOutlineDelete } from 'react-icons/md'
import { toast } from 'react-toastify'

const RestaurantList = () => {
  axios.defaults.withCredentials = true


  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { restaurants } = useSelector((state) => state.restaurant)

  const tableHeader = [
    'Image',
    'Name',
    'City',
    'Rating',
    'Status',
    'Open Now',
    'Actions'
  ]


  const deleteRestaurant = async (restaurantId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/restaurant/delete/${restaurantId}`)
      if(response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getRestaurantList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant/list')
      if (response.data.success) {
        dispatch(setRestaurants(response.data.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRestaurantList()
  }, [restaurants])

  return (
    <div className="w-full overflow-x-auto p-4">
      <table className="w-full table-fixed border-collapse text-left">
        <thead className="bg-gray-100 uppercase">
          <tr>
            {tableHeader.map((item, index) => (
              <th key={index} className="px-4 py-2 border-b border-gray-300">{item}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <tr key={restaurant._id} className="border-b border-gray-200 text-[16px] font-medium text-gray-700">
                <td className="px-4 py-2">
                  <img
                    className="w-24 h-16 object-cover rounded"
                    src={`http://localhost:5000/images/${restaurant.image}`}
                    alt={restaurant.restaurantName}
                  />
                </td>
                <td className="px-4 py-2">{restaurant.restaurantName}</td>
                <td className="px-4 py-2">{restaurant.city}</td>
                <td className="px-4 py-2">{restaurant.rating}/5</td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded ${restaurant.status === 'active' ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'}`}>
                    {restaurant.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded text-white ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                    {restaurant.isOpen ? 'Open' : 'Close'}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-3 mt-4.5">
                  <button
                    className="px-2 py-1 rounded bg-gray-700 text-white text-[14px] cursor-pointer"
                    onClick={() => {
                      dispatch(setRestaurantId(restaurant._id))
                      navigate('/restaurant/details')
                    }}
                  >
                    View
                  </button>
                  <button
                    className="px-1 py-1 flex justify-center items-center rounded bg-blue-600 text-white text-[24px] cursor-pointer"
                    onClick={() => {
                      dispatch(setRestaurantId(restaurant._id))
                      navigate(`/restaurant/update`)
                    }}
                  >
                    <FaRegEdit className="inline" />
                  </button>
                  <button
                    className="px-1 py-1 flex justify-center items-center rounded bg-red-600 text-white text-[24px] cursor-pointer"
                    onClick={() => deleteRestaurant(restaurant._id)}
                  >
                    <MdOutlineDelete className="inline" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-15 text-2xl text-gray-700 font-medium">
                No Restaurants Found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RestaurantList
