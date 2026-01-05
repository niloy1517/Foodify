import React, { useContext, useState } from 'react'
import { SiIfood } from "react-icons/si";
import { FaRegUser, FaBasketShopping } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import { useSelector } from 'react-redux';
import { storeContext } from '../../Context/Context';

const MobileNavbar = () => {
    const { setShowAuthenticationPopup, setLoginPopup, setFindFoodByLocationPopup, setUserProfilePopup, setUserCartModal } = useContext(storeContext)

    const carts = useSelector((state) => state.cart.carts);
    const restaurantId = useSelector((state) => state.restaurant.restaurantId);
    const restaurantData = useSelector((state) => state.restaurant.restaurantData);
    const userData = useSelector((state) => state.user.userData);
    const allRestaurantData = useSelector((state) => state.cart.allRestaurantData);
    const userId = userData?._id || "guest";
    const userCart = carts?.[userId] || {};
    const restaurantCart = userCart?.[restaurantId] || {};
    const items = restaurantCart?.items || [];
    console.log(restaurantData)
    return (
        <div>
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
                                onClick={() => { setUserProfilePopup(true) }}
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

                <div
                    onClick={() => setFindFoodByLocationPopup(true)}
                    className='flex items-center gap-2 justify-center pt-4 text-[15px] cursor-pointer font-medium text-gray-600'>
                    <GrLocation className='text-2xl font-medium' />
                    <p>Road 71, Habiganj sadar, Habiganj</p>
                </div>
            </div>
        </div >
    )
}

export default MobileNavbar