import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { storeContext } from '../Context/Context';

const MenuCategory = () => {
    const [categories, setCategories] = useState([])
    const { updateFilter, filters } = useContext(storeContext)

    const navigate = useNavigate()

    // Store user location from localStorage
    const defaultLocation = JSON.parse(localStorage.getItem('defaultLocation'))


    const getCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/category/list`)
            setCategories(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCategories()
    }, [])



    const query = Object.fromEntries(
        Object.entries(filters).filter(
            ([_, value]) => value !== undefined && value !== null && value !== ""
        )
    )

    const queryString = new URLSearchParams(query).toString()

    const baseUrl = `/restaurants/new?lat=${defaultLocation?.lat}&lng=${defaultLocation?.lon}`;

    useEffect(() => {
        const handleNavigate = () => {
            navigate(queryString ? `${baseUrl}&${queryString}` : baseUrl)
        }

        handleNavigate()
    }, [filters])

    return (
        <div className="w-full">
            <h1 className="text-3xl font-semibold text-gray-700 mb-8">Menu Category</h1>

            <div className="relative w-full">
                {/* Left Arrow */}
                <button
                    className='hidden md:flex absolute left-[-15px] top-1/2 -translate-y-1/2 z-10 p-3 rounded-full border border-gray-400 bg-white cursor-pointer menu-prev'
                >
                    <FaArrowLeft />
                </button>

                {/* Swiper */}
                <Swiper
                    modules={[Navigation]}
                    slidesPerView="auto"
                    spaceBetween={16}
                    navigation={{
                        prevEl: ".menu-prev",
                        nextEl: ".menu-next",
                    }}
                    className="w-full"
                >
                    {categories.map((cate, index) => (
                        <SwiperSlide
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                updateFilter('category', cate._id)
                            }}
                            className="!w-[140px] !h-[180px] flex flex-col text-center shrink-0 cursor-pointer"
                        >
                            <img
                                className="w-full h-[140px] rounded-2xl hover:scale-105 transition"
                                src={`http://localhost:5000/images/${cate.image}`}
                                alt=""
                            />
                            <span className="font-medium">{cate.name}</span>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Right Arrow */}
                <button
                    className='hidden md:flex absolute right-[-17px] top-1/2 -translate-y-1/2 z-10 p-3 rounded-full border border-gray-300 bg-white cursor-pointer menu-next'
                >
                    <FaArrowRight />
                </button>
            </div>

        </div>
    )
}

export default MenuCategory
