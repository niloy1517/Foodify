import React, { useContext, useState } from 'react'
import { SiIfood } from "react-icons/si";
import { FaRegUser, FaBasketShopping } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import { SlArrowDown } from "react-icons/sl";
import { useSelector } from 'react-redux';
import { storeContext } from '../../Context/Context';
import FindFoodByLocationPopup from '../../AllPopupPages/FindFoodByLocationPopup';

const DesktopNavbar = () => {
    const { setShowAuthenticationPopup, setLoginPopup, setIsLoginPage, setFindFoodByLocationPopup, setUserProfilePopup, setUserCartModal } = useContext(storeContext)

    const userData = useSelector((state) => state.user.userData)
    const allRestaurantData = useSelector((state) => state.cart.allRestaurantData);
    
    //Get location from localStorage
    let defaultLocation = JSON.parse(localStorage.getItem('defaultLocation'))
    
    
    return (
        <div className='w-full'>
            <div className='flex items-center justify-between px-10 py-8 shadow'>
                <div className='flex items-center gap-1.5 text-4xl font-bold text-orange-600'>
                    <SiIfood />
                    <p>Foodify.</p>
                </div>
                <div
                    onClick={() => setFindFoodByLocationPopup(true)}
                    className='flex items-center gap-2 justify-center text-[17px] font-medium text-gray-600 px-3 py-1 rounded cursor-pointer hover:bg-gray-50'>
                    <GrLocation className='text-2xl font-medium' />
                    <p className='truncate max-w-[200px]'>{defaultLocation?.display_name}</p>
                </div>
                <div className='flex items-center gap-10'>
                    {
                        !userData ?
                            <div className='flex items-center gap-10'>
                                <button onClick={() => { setShowAuthenticationPopup(true), setLoginPopup(true) }} className='border border-gray-200 rounded px-2 py-1 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 hover:scale-105'>Sign In</button>
                                <button onClick={() => { setShowAuthenticationPopup(true), setIsLoginPage(false) }} className='bg-orange-600 text-white px-4 py-1 rounded font-semibold cursor-pointer hover:scale-105'>Sign up for free delivery</button>
                            </div>
                            :
                            <button onClick={() => {
                                setUserProfilePopup(true);
                                setIsScroll(true)
                            }} className='flex items-center gap-1 text-gray-700 hover:bg-orange-100 px-3 py-1 rounded cursor-pointer'>
                                <FaRegUser className='text-2xl' />
                                <p className='text-[18px] font-semibold'>{userData?.profile?.name}</p>
                                <SlArrowDown />
                            </button>
                    }
                    <button onClick={() => setUserCartModal(true)} className='relative w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center text-gray-500 cursor-pointer'>
                        <FaBasketShopping className='text-2xl' />
                        {
                            allRestaurantData.length > 0 &&
                            <p className='absolute top-0 right-[-10px] size-5 flex items-center justify-center text-white text-[13px] rounded-full bg-orange-600'>{allRestaurantData.length}</p>

                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DesktopNavbar