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
    <div className='relative'>
      <button className="hidden md:flex new-prev p-3 rounded-full border border-gray-300 bg-white absolute left-[-15px] hover:scale-120 transform top-1/2 -translate-y-1/2 z-10 cursor-pointer">
        <FaArrowLeft />
      </button>
      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={12}
        navigation={{
          prevEl: ".new-prev",
          nextEl: ".new-next",
        }}
      >

        <div className='flex justify-between items-center bg-amber-200 relative'>
          {
            restaurants?.map(restaurant => (
              <SwiperSlide
                key={restaurant._id}
                className='min-w-56 max-w-72 max-h-70  shrink-0 rounded-[10px] overflow-hidden cursor-pointer'
              >
                <RestaurantCard restaurant={restaurant} from="swiperJsx" />
              </SwiperSlide>
            ))
          }
        </div>


      </Swiper>
      <button className="hidden md:flex new-next p-3 rounded-full border border-gray-300 bg-white absolute right-[-15px] hover:scale-120 transform top-1/2 -translate-y-1/2 z-10 cursor-pointer">
        <FaArrowRight />
      </button>
    </div>
  );
};

export default SwiperSlider;
