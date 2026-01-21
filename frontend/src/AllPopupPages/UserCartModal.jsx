import React, { useContext, useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { deleteCartRestaurant, setCheckoutDetails } from '../Service/Redux/Slice/AddToCartItemSlice';
import { storeContext } from '../Context/Context';
import { useOrderManager } from '../Hooks/useOrderManager'

const UserCartModal = () => {
  const { setUserCartModal } = useContext(storeContext)

  const { getOrderData } = useOrderManager()

  const carts = useSelector((state) => state.cart.carts);
  const allRestaurantData = useSelector((state) => state.cart.allRestaurantData);
  const userData = useSelector((state) => state.user.userData);

  const userId = userData?._id || "guest";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?._id) {
      getOrderData();
    }
  }, [userData?._id]);

  return (
    <div className='h-[100vh] w-full md:w-[350px] overflow-y-auto top-0 slide-bar absolute z-20 right-0 mx-auto bg-white shadow'>
      {/* Header */}
      <div className='flex justify-between items-center p-6'>
        <p className='text-[20px] font-medium'>All Carts</p>
        <div className='size-9 flex justify-center items-center rounded-full border border-gray-200 hover:scale-110 cursor-pointer'>
          <RxCross2 onClick={() => setUserCartModal(false)} className='text-2xl font-bold' />
        </div>
      </div>

      {/* Restaurant Carts */}
      <div className='w-full select-none'>
        <div className='flex flex-col gap-4 p-4'>
          {allRestaurantData.map(restaurantData => {
            const restaurantId = restaurantData._id;

            const restaurantCart = carts[userId]?.[restaurantId];
            const items = restaurantCart?.items || [];

            // Skip restaurant if no items
            if (items.length === 0) return null;

            return (
              <div key={restaurantId} className='flex flex-col border border-gray-200 rounded-2xl p-3'>
                {/* Restaurant Info */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <img className='size-18 rounded-[8px]' src={`http://localhost:5000/images/${restaurantData.image}`} alt="" />
                    <div className='flex flex-col gap-3 px-2'>
                      <p className='font-bold text-[18px]'>{restaurantData.restaurantName}</p>
                      <p>{restaurantData.deliveryTime} mins</p>
                    </div>
                  </div>
                  <div className='size-10 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer'>
                    <RiDeleteBinLine onClick={() => dispatch(deleteCartRestaurant(restaurantId))} className='text-2xl text-gray-700' />
                  </div>
                </div>

                {/* Restaurant Items */}
                <div className='flex space-x-2 mt-6 w-full overflow-x-auto'>
                  {items.map(item => (
                    <img
                      key={item._id}
                      className='size-14 rounded-[8px] border border-gray-200'
                      src={`http://localhost:5000/images/${item.image}`}
                      alt={item.foodName}
                    />
                  ))}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    dispatch(setCheckoutDetails({ restaurantData, items }));
                    navigate('/checkout');
                    setUserCartModal(false)
                  }}
                  className='mt-6 w-full h-10 border border-orange-500 font-medium cursor-pointer text-gray-700 rounded-[8px] hover:scale-105 transition duration-200'
                >
                  Go to checkout
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserCartModal;
