import React, { useContext } from 'react'
import SwiperSlider from '../components/SwiperSlider'
import { storeContext } from '../Context/Context';



const NewRestaurantsPage = () => {
  const { restaurants } = useContext(storeContext)

  if (!restaurants || restaurants.length === 0) {
    return <p className='text-center text-2xl text-gray-700'>No restauant found</p>
  }

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-semibold text-gray-700 py-8'>New on Foodify</h1>
      <SwiperSlider restaurants={[...restaurants].reverse().slice(0, 20)} />
    </div>
  )
}

export default NewRestaurantsPage