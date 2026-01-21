import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaLock } from "react-icons/fa";
import { decrement, increment, deleteToCart, setCheckoutDetails } from '../Service/Redux/Slice/AddToCartItemSlice';
import { useNavigate } from 'react-router-dom';
import { storeContext } from '../Context/Context';
import { useOrderManager } from '../Hooks/useOrderManager'

const AddToCartBox = () => {
  const { setLoginPopup, setShowAuthenticationPopup } = useContext(storeContext);
  const { getOrderData } = useOrderManager();

  const [orderData, setOrderData] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const carts = useSelector((state) => state.cart.carts);
  const restaurantData = useSelector((state) => state.restaurant.restaurantData);
  const restaurantId = useSelector((state) => state.restaurant.restaurantId);
  const userData = useSelector((state) => state.user.userData);

  const userId = userData?._id || "guest";


  const userCart = carts?.[userId] || {};
  const restaurantCart = userCart?.[restaurantId] || {};
  const items = restaurantCart?.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = restaurantData?.deliveryFee || 0;
  const total = subtotal + deliveryFee;


  useEffect(() => {
    if (userData?._id) {
      getOrderData();
    }
  }, [userData?._id]);

  return (
    <div className='hidden relative mt-28 w-[400px] h-[740px] lg:flex flex-col border-2 border-gray-300 rounded-2xl'>

      {/* Cart Items */}
      <div className='overflow-y-auto'>
        <div>
          {items.length > 0 ? (
            <div className='flex flex-col gap-4 mt-4'>
              <p className='text-[20px] font-medium px-2'>Your Items</p>
              <div className='h-[380px] flex flex-col gap-4 overflow-y-auto'>
                {items.map(item => (
                  <div key={item._id} className='flex items-center px-2'>
                    <img className='size-20 rounded-[10px]' src={`${import.meta.env.VITE_IMAGE_BASE_URL}/images/${item.image}`} alt="" />
                    <div className='w-full flex flex-col gap-3 px-4'>
                      <p className='text-[20px] font-medium text-gray-700'>{item.foodName}</p>
                      <div className='w-full flex items-center justify-between'>
                        <p className='text-[18px] font-medium text-gray-700'>Tk. {item.price}</p>
                        <div className='flex gap-4 text-[20px] border border-gray-200 rounded-[18px] text-gray-700'>
                          <div className='size-9 rounded-full flex items-center justify-center text-3xl border border-gray-200'>
                            <button className='cursor-pointer'>
                              {item.quantity === 1 ? (
                                <RiDeleteBinLine
                                  onClick={() => dispatch(deleteToCart({ ...item, restaurant: restaurantId }))}
                                  className='text-[22px]'
                                />
                              ) : (
                                <GrFormSubtract
                                  onClick={() => dispatch(decrement({ ...item, restaurant: restaurantId }))}
                                />
                              )}
                            </button>
                          </div>
                          <p className='font-medium text-[20px]'>{item.quantity}</p>
                          <div className='size-9 rounded-full flex items-center justify-center text-3xl border border-gray-200'>
                            <button
                              onClick={() => dispatch(increment({ ...item, restaurant: restaurantId }))}
                              className='cursor-pointer'
                            >
                              <IoIosAdd />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='absolute w-full bottom-2 '>
                {/* Summary */}
                <div className='px-2 text-[18px] text-gray-700 font-medium'>
                  <div className='border-b border-gray-200 pb-4'>
                    <p className='flex justify-between items-center'>Subtotal: <span>tk {subtotal}</span></p>
                    <p className='flex justify-between items-center'>Standard delivery: <span>tk {deliveryFee}</span></p>
                  </div>
                  <p className='flex justify-between items-center'>Total: <span>tk {total}</span></p>
                </div>

                {/* Checkout Button */}
                <div className='mx-2'>
                  {
                    orderData?.orderStatus !== 'Delivered' && restaurantId === orderData?.restaurant?._id ?
                      <button className='w-full flex items-center justify-center gap-2 h-12 mt-2 cursor-pointer font-medium text-[18px] bg-gray-300 text-white rounded'>
                        <FaLock /> Order locked
                      </button>
                      :
                      <button
                        onClick={() => {
                          dispatch(setCheckoutDetails({ restaurantData, items }));
                          navigate('/checkout');
                          if (!userData) {
                            setShowAuthenticationPopup(true)
                            setLoginPopup(true)
                          }
                        }}
                        className='w-full h-12 mt-2 cursor-pointer font-medium text-[18px] bg-orange-600 text-white rounded'
                      >
                        Proceed to Checkout
                      </button>
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className='w-full h-full flex flex-col items-center justify-center mt-[30%]'>
              <img className='w-30' src={assets.cart_empty} alt="" />
              <p className='font-medium'>Hungry?</p>
              <p className='text-center'>You haven't added anything to <br /> your cart!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToCartBox;
