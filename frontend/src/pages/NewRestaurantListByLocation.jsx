import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IoMdTime } from "react-icons/io"
import { MdOutlineDeliveryDining } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setRestaurantId } from '../Service/Redux/Slice/RestaurantSlice'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { PiDotOutlineFill } from "react-icons/pi";
import { TbCurrencyTaka } from "react-icons/tb";

const NewRestaurantListByLocation = () => {
    const [restaurants, setRestaurants] = useState([])
    const userData = useSelector((state) => state.user.userData)

    axios.defaults.withCredentials = true;




    const navigate = useNavigate()
    const dispatch = useDispatch()



    const handleNavigate = (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        navigate(`/restaurant/${slug}`)
    }


    const getNewRestaurantsByLocation = async () => {
        try {
            let lat, lng;

            if (userData && userData.address && userData.address.length > 0) {
                lat = userData?.address[0].location.coordinates[1]
                lng = userData?.address[0].location.coordinates[0]

            } else {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                })

                lat = position.coords.latitude;
                lng = position.coords.longitude;
            }

            const response = await axios.get(`http://localhost:5000/api/restaurant/all/restaurants`,
                {
                    params: { lat, lng }
                }
            )
            setRestaurants(response.data.data.reverse())
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getNewRestaurantsByLocation()
    }, [])


    return (
        <div className='w-full pt-8'>
            <h1 className='text-3xl font-semibold text-gray-700 pb-6'>New on Foodify</h1>
            <div className='w-full relative'>
                <button className="hidden md:flex new-prev p-3 rounded-full border border-gray-300 bg-white absolute left-[-15px] hover:scale-120 transform top-1/2 -translate-y-1/2 z-20 cursor-pointer">
                    <FaArrowLeft />
                </button>
                <Swiper
                    modules={[Navigation]}
                    slidesPerView="auto"
                    spaceBetween={16}
                    navigation={{
                        prevEl: ".new-prev",
                        nextEl: ".new-next",
                    }}
                >

                    <div className='flex justify-between items-center bg-amber-200 relative'>
                        {/* Desktop arrows */}

                        {restaurants?.slice(0, 6).map((restaurant, index) => (
                            <SwiperSlide
                                key={index}
                                onClick={() => { dispatch(setRestaurantId(restaurant._id)), handleNavigate(restaurant.restaurantName) }}
                                className='min-w-56 max-w-75 min-h-60 max-h-64 shrink-0 border border-gray-300 rounded-2xl overflow-hidden cursor-pointer'
                            >
                                <img className='w-full h-40 hover:scale-105 transition transform duration-200' src={`http://localhost:5000/images/${restaurant.image}`} alt={restaurant.name} />
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
                            </SwiperSlide>
                        ))}

                    </div>
                </Swiper>
                <button className="hidden md:flex new-next p-3 rounded-full border border-gray-300 bg-white hover:scale-120 absolute right-[-17px] transform top-1/2 -translate-y-1/2 z-20 cursor-pointer">
                    <FaArrowRight />
                </button>
            </div>
        </div>
    )
}

export default NewRestaurantListByLocation