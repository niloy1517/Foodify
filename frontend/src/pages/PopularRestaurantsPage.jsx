import React, { useContext } from 'react'
import { storeContext } from '../Context/Context'
import SwiperSlider from '../components/SwiperSlider'

const PopularRestaurantsPage = () => {
    const {restaurants} = useContext(storeContext)
    return (
        <div className='w-full'>
            <h1 className='text-3xl font-semibold text-gray-800 py-8'>Popular restaurants in your area</h1>
            <SwiperSlider restaurants={restaurants} />
        </div>
    )
}

export default PopularRestaurantsPage