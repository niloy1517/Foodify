import React from 'react'
import { storeContext } from '../Context/Context'
import { useContext } from 'react'
import { setRestaurantId } from '../Service/Redux/Slice/RestaurantSlice'
import { useDispatch } from 'react-redux'
import { IoMdTime } from "react-icons/io"
import { MdOutlineDeliveryDining } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'

const FilteredRestaurants = () => {
    const { searchRestaurants, setSearchRestaurants } = useContext(storeContext)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleNavigate = (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        navigate(`/restaurant/${slug}`)
    }
    return (
        <div>
            {
                !searchRestaurants?.length ?
                    <h1 className='text-3xl text-gray-700'>NO RESTAURANTS FOUND</h1>
                    :
                    <div>
                        <h1 className='text-3xl text-gray-700 mb-6'>{searchRestaurants.length} Restaurants found</h1>
                        <div className='grid grid-cols-3 gap-8'>
                            {
                                searchRestaurants.map(restaurant => (
                                    <div onClick={() => { dispatch(setRestaurantId(restaurant._id)), handleNavigate(restaurant.restaurantName) }} key={restaurant.index} className='w-78 h-66 shrink-0 bg-gray-50 border border-gray-300 rounded-2xl overflow-hidden cursor-pointer'>
                                        <img className='w-full h-42 hover:max-h-42 hover:scale-105 transition transform duration-400' src={`http://localhost:5000/images/${restaurant.image}`} alt={restaurant.name} />
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
            }
        </div>
    )
}

export default FilteredRestaurants