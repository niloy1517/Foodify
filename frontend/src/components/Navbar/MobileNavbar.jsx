import React, { useContext, useState } from 'react'
import { SiIfood } from "react-icons/si";
import { FaRegUser, FaBasketShopping } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import { useSelector } from 'react-redux';
import { storeContext } from '../../Context/Context';

const MobileNavbar = () => {
    const { setShowAuthenticationPopup, setLoginPopup, setFindFoodByLocationPopup, setIsDropdownMenu, setUserCartModal } = useContext(storeContext)

    const userData = useSelector((state) => state.user.userData);
    const allRestaurantData = useSelector((state) => state.cart.allRestaurantData);

    //Get location from localStorage
    let defaultLocation = JSON.parse(localStorage.getItem('defaultLocation'))

    return (
        <div className='z-50'>
            <div className='py-2 shadow'>
                <div className='flex justify-between items-center px-6 py-2'>
                    {
                        !userData ?
                            <FaRegUser
                                onClick={() => { setShowAuthenticationPopup(true), setLoginPopup(true) }}
                                className='text-2xl cursor-pointer'
                            />
                            :
                            <FaRegUser
                                onClick={() => { setIsDropdownMenu(true) }}
                                className='text-2xl cursor-pointer'
                            />
                    }
                    <div className='flex items-center gap-1.5 text-2xl font-bold text-orange-600'>
                        <SiIfood />
                        <p>Foodify.</p>
                    </div>

                    <button onClick={() => setUserCartModal(true)} className='relative w-10 h-10 rounded-full bg-gray-50 flex justify-center items-center text-gray-500 cursor-pointer'>
                        <FaBasketShopping className='text-2xl' />
                        {
                            allRestaurantData.length > 0 &&
                            <p className='absolute top-0 right-[-10px] size-5 flex items-center justify-center text-white text-[13px] rounded-full bg-orange-600'>{allRestaurantData.length}</p>

                        }
                    </button>

                </div>

                {
                    defaultLocation &&
                    <div
                        onClick={() => setFindFoodByLocationPopup(true)}
                        className='flex items-center gap-2 justify-center pt-4 text-[15px] cursor-pointer font-medium text-gray-600'>
                        <GrLocation className='text-2xl font-medium' />
                        <p className='max-w-[50%] truncate'>{defaultLocation.display_name}</p>
                    </div>
                }
            </div>
        </div >
    )
}

export default MobileNavbar