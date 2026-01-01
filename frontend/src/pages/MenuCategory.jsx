import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const MenuCategory = () => {
    const [categories, setCategories] = useState([])

    const navigate = useNavigate()

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



    return (
        <div className="w-full">
            <h1 className="text-3xl font-semibold text-gray-700 mb-8">Menu Category</h1>

            <div className="relative w-full">
                {/* Left Arrow */}
                <button
                    className='hidden md:flex absolute left-[-15px] top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-gray-400 bg-white cursor-pointer swiper-button-prev-custom'
                >
                    <FaArrowLeft />
                </button>

                {/* Swiper */}
                <Swiper
                    modules={[Navigation]}
                    slidesPerView="auto"
                    spaceBetween={16}
                    navigation={{
                        prevEl: ".swiper-button-prev-custom",
                        nextEl: ".swiper-button-next-custom",
                    }}
                    className="w-full"
                >
                    {categories.map((cate, index) => (
                        <SwiperSlide
                            key={index}
                            onClick={() => navigate(`/category/restaurant/${cate._id}`)}
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
                    className='hidden md:flex absolute right-[-17px] top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-gray-300 bg-white cursor-pointer swiper-button-next-custom'
                >
                    <FaArrowRight />
                </button>
            </div>

        </div>
    )
}

export default MenuCategory
