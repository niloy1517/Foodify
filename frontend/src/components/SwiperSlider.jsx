import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import RestaurantCard from "./RestaurantCard";

const SwiperSlider = ({ restaurants }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
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
          {
            restaurants?.slice(0, 6).map(restaurant => (
              <SwiperSlide
                key={restaurant._id}
                className='min-w-56 max-w-75 min-h-60 max-h-64 shrink-0 border border-gray-300 rounded-2xl overflow-hidden cursor-pointer'
              >
                <RestaurantCard restaurant={restaurant} />
              </SwiperSlide>
            ))
          }
        </div>


      </Swiper>
      <button className="hidden md:flex new-next p-3 rounded-full border border-gray-300 bg-white absolute right-[-15px] hover:scale-120 transform top-1/2 -translate-y-1/2 z-20 cursor-pointer">
        <FaArrowRight />
      </button>
    </div>
  );
};

export default SwiperSlider;
