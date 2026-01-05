import { useNavigate } from 'react-router-dom'
import { IoMdTime } from "react-icons/io"
import { MdOutlineDeliveryDining } from "react-icons/md"
import { FaStar } from "react-icons/fa"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { PiDotOutlineFill } from "react-icons/pi";
import { TbCurrencyTaka } from "react-icons/tb";
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setRestaurantId } from '../Service/Redux/Slice/RestaurantSlice'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const RestaurantSlider = () => {

    const [restaurants, setRestaurants] = useState([])

    const dispatch = useDispatch()



    const navigate = useNavigate()

    const handleNavigate = (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        navigate(`/restaurant/${slug}`)
    }


    const getRestaurantList = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/restaurant/list')
            if (response.data.success) {
                setRestaurants(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getRestaurantList()
    }, [])

    return (
        <div className='px-4 md:px-10 py-15'>
            <h1 className='text-[28px] md:text-[35px] font-bold pb-15'>Popular restaurants in your area</h1>

            <div className='w-full flex justify-center items-center'>
                <button className="hidden md:flex swiper-button-prev-custom p-3 rounded-full border border-gray-300 bg-white hover:scale-120 absolute transform translate-y-1/2 left-5 z-20 cursor-pointer">
                    <FaArrowLeft />
                </button>
                <Swiper
                    modules={[Navigation]}
                    slidesPerView="auto"
                    spaceBetween={16}
                    navigation={{
                        prevEl: ".swiper-button-prev-custom",
                        nextEl: ".swiper-button-next-custom",
                    }}
                    className='md:w-full flex justify-cente'
                >

                    <div className=' relative'>

                        {restaurants.map((restaurant, index) => (
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
                                            {JSON.parse(restaurant.cuisines).map((cuisine, index) => (
                                                <div key={index} className='flex items-center'>
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
                <button className="hidden md:flex swiper-button-next-custom p-3 rounded-full border border-gray-300 bg-white hover:scale-120 absolute transform translate-y-1/2 right-5 z-20 cursor-pointer">
                    <FaArrowRight />
                </button>
            </div>
        </div>
    )
}

export default RestaurantSlider

