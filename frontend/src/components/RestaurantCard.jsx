import React from 'react'
import { MdOutlineDeliveryDining } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { PiDotOutlineFill } from "react-icons/pi";
import { TbCurrencyTaka } from "react-icons/tb";
import { setRestaurantId } from '../Service/Redux/Slice/RestaurantSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant, from }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleNavigate = (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        navigate(`/restaurant/${slug}`)
    }

   

    return (
        <div
            onClick={() => { dispatch(setRestaurantId(restaurant._id)), handleNavigate(restaurant.restaurantName) }}
            className={
                `${from === 'swiperJsx' && 'w-[290px] xl:w-[280px] h-[240px] xl:h-[250px]'} ${from === 'filteredRestaurantsPageJsx' && 'xl:h-[270px]' }
                 w-full h-[22rem] xl:h-[17rem] shrink-0 border border-gray-300 rounded-[10px] overflow-hidden cursor-pointer
                 `}
        >
            <img className={`${from === 'swiperJsx' && 'w-full h-[150px]'} ${from === 'filteredRestaurantsPageJsx' && 'xl:h-[170px]' } w-full h-[72%] xl:h-[65%] hover:scale-105 transition transform duration-200`} src={`http://localhost:5000/images/${restaurant.image}`} alt={restaurant.name} />
            <div className='p-2 text-sm'>
                <div className='flex justify-between font-semibold'>
                    <p className='text-[22px] font-semibold'>{restaurant.restaurantName}</p>
                    <div className='flex items-center text-sm text-gray-700'>
                        <FaStar className='text-amber-500 text-[16px]' />
                        <p className='pl-2 pr-1'>{restaurant.rating}</p>
                        <p className=''>(300+)</p>
                    </div>
                </div>
                <div className='w-full flex items-center space-x-2 text-sm text-gray-700 truncate'>

                    <p className='flex'>{restaurant.deliveryTime} min</p>

                    <div className='flex flex-1 items-center'>
                        <div className='flex items-center text-[18px] font-bold space-x-[-8px]'>
                            <PiDotOutlineFill />
                            <TbCurrencyTaka />
                            <TbCurrencyTaka />
                        </div>
                        <div className='flex items-center'>
                            {restaurant.cuisines.map(cuisine => (
                                <div className="flex items-center gap-1 truncate">
                                    {restaurant.cuisines.map((cuisine, index) => (
                                        <span key={index} className="flex items-center">
                                            <PiDotOutlineFill />
                                            {cuisine}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <div className='flex items-center space-x-1 text-gray-700 font-semibold pb-1'>
                    <MdOutlineDeliveryDining className='text-[20px]' />
                    <p>Tk {restaurant.deliveryFee}</p>
                </div>
            </div>
        </div>

    )
}

export default RestaurantCard