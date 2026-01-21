import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { LuLocateFixed } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import DotLoading from '../Loading/DotLoading/DotLoading';
import { useNavigate } from 'react-router-dom';
import { useLocationRestaurants } from '../Hooks/useLocationRestaurants';
import { storeContext } from '../Context/Context';

const Hero = () => {
  const {
    searchKey,
    setSearchKey,
    searchAddresses,
    setSearchAddresses,
    searchLocation,
    setFullAddressData,
    saveAddressInLocalStorage,
    locateLocation
  } = useLocationRestaurants();

  const { isOverlay } = useContext(storeContext);

  const [loading, setLoading] = useState(false)

  const defaultLocation = JSON.parse(localStorage.getItem('defaultLocation'))

  const navigate = useNavigate()


  const handleLoading = () => {
    searchKey ? setLoading(true) : alert('Enter your address')
    searchKey &&
      setTimeout(() => {
        setLoading(false)
        navigate(`/restaurants/new?lat=${defaultLocation?.lat}&lng=${defaultLocation?.lon}`)
      }, 2000)
  }


  useEffect(() => {
    if (defaultLocation) {
      navigate(`/restaurants/new?lat=${defaultLocation?.lat}&lng=${defaultLocation?.lon}`)
    }
  }, [])

  return (
    <div className={`w-full h-auto relative ${isOverlay && '-z-10'}`}>
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
              type="text"
              value={searchKey}
              onChange={(e) => searchLocation(e.target.value)}
              placeholder='Enter your address'
              className='border-0 outline-0 flex-1 text-gray-700 placeholder-gray-500'
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
            onClick={() => {
              handleLoading();
              saveAddressInLocalStorage()
            }}
            className='flex justify-center bg-orange-600 hover:bg-orange-700 text-center text-white px-6 py-3 rounded-lg cursor-pointer font-medium transition-all duration-200 hover:shadow-lg min-w-[120px]'
          >
            {!loading ? 'Find Food' : <DotLoading />}
          </button>
        </div>
      </div>

      <div className='w-full absolute flex justify-center md:mt-[-50px] z-30 px-4'>
        {
          searchAddresses.length > 0 &&
          <ul className='max-w-[600px] flex flex-col gap-2 bg-white p-4 shadow-2xl'>
            {
              searchAddresses.map((address, index) => (
                <li onClick={() => { setSearchKey(address.display_name); setFullAddressData(address); setSearchAddresses('') }} key={index} className='w-full flex items-center gap-8 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer px-3'>
                  <CiSearch className='text-2xl font-bold shrink-0' />
                  <span>{address.display_name}</span>
                </li>
              ))
            }
          </ul>
        }
      </div>
    </div>
  )
}

export default Hero

