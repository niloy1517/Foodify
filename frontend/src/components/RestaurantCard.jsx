import React from 'react'
import { MdOutlineDeliveryDining } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { PiDotOutlineFill } from "react-icons/pi";
import { TbCurrencyTaka } from "react-icons/tb";
import { setRestaurantId } from '../Service/Redux/Slice/RestaurantSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleNavigate = (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        navigate(`/restaurant/${slug}`)
    }

    return (
        <div
            onClick={() => { dispatch(setRestaurantId(restaurant._id)), handleNavigate(restaurant.restaurantName) }}
            className='w-full min-h-60 max-h-85 shrink-0 border border-gray-300 rounded-2xl overflow-hidden cursor-pointer'
        >
            <img className='w-full h-60 xl:h-40 hover:scale-105 transition transform duration-200' src={`http://localhost:5000/images/${restaurant.image}`} alt={restaurant.name} />
            <div className='flex justify-between px-2 font-semibold'>
                <p className='text-[20px] font-semibold py-1'>{restaurant.restaurantName}</p>
                <div className='flex items-center text-sm text-gray-700'>
                    <FaStar className='text-amber-500 text-[18px]' />
                    <p className='pl-2 pr-1'>{restaurant.rating}</p>
                    <p className=''>(3500+)</p>
                </div>
            </div>
            <div className='w-full flex items-center space-x-2 text-sm font-semibold text-gray-700 truncate px-2'>

                <p className='flex shrink-0 '>{restaurant.deliveryTime} min</p>

                <div className='flex flex-1 items-center'>
                    <div className='flex items-center text-[18px] font-bold space-x-[-8px]'>
                        <PiDotOutlineFill />
                        <TbCurrencyTaka />
                        <TbCurrencyTaka />
                    </div>
                    <div className='flex items-center shrink-0 truncate '>
                        {JSON.parse(restaurant.cuisines).map(cuisine => (
                            <div className='flex items-center'>
                                <PiDotOutlineFill />
                                <p key={cuisine.index}>{cuisine}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <div className='flex items-center space-x-1 px-2 pt-2 text-gray-700 font-semibold pb-1'>
                <MdOutlineDeliveryDining className='text-[20px]' />
                <p>Tk {restaurant.deliveryFee}</p>
            </div>
        </div>

    )
}

export default RestaurantCard