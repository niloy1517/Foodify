import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { LuLocateFixed } from "react-icons/lu";
import { storeContext } from '../Context/Context';

const Hero = () => {
  const { locateLocation } = useContext(storeContext);



  return (
    <div className='w-full h-auto relative'>
      <img 
        className='w-full h-auto object-cover max-h-[600px]' 
        src={assets.banner} 
        alt="Food delivery banner" 
      />
      
      {/* Overlay content */}
      <div className='mt-[-90px] md:mt-0 md:absolute inset-0 flex flex-col gap-6 justify-center items-center text-center px-4'>
        <h1 className='text-[20px] md:text-4xl lg:text-5xl font-bold  max-w-3xl leading-tight drop-shadow-lg'>
          Sign up for free delivery on your first order
        </h1>
        
        <div className='bg-white flex flex-col md:flex-row justify-between gap-4 p-4 rounded-lg shadow-2xl w-full max-w-[600px]'>
          <div className='flex flex-1 border border-gray-300 px-4 py-3 rounded-lg gap-4 items-center'>
            <input 
              className='border-0 outline-0 flex-1 text-gray-700 placeholder-gray-500'
              type="text"
              placeholder='Enter your address'

            />
            <button
              onClick={locateLocation}
              className='flex items-center gap-2 text-gray-600 hover:text-orange-600 cursor-pointer '
            >
              <LuLocateFixed className='text-xl cursor-pointer' /> 
              <span className='hidden sm:inline'>Locate me</span>
            </button>
          </div>
          
          <button 

            className='bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg cursor-pointer font-medium transition-all duration-200 hover:shadow-lg min-w-[120px]'
          >
            Find Food
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero

