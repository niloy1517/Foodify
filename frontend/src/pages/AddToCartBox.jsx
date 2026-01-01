import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { GrRestaurant } from "react-icons/gr";
import { MdRestaurant } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { BsClockFill } from "react-icons/bs";
import { IoStar } from "react-icons/io5";
import { FaLock } from "react-icons/fa";

import { decrement, increment, deleteToCart, setCheckoutDetails } from '../Service/Redux/Slice/AddToCartItemSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading/Loading';

const AddToCartBox = () => {
  const [activeBtn, setActiveBtn] = useState('addtocart');
  const [orderData, setOrderData] = useState({});
  const [pending, setPending] = useState(false);

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


  const getOrderData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/order/list/${userData._id}`)
      const runingOrder = response?.data?.data.find(ord => ord.paymentStatus === 'Paid' && ord.orderStatus !== 'Completed')
      setOrderData(runingOrder)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getOrderData()
  }, [])
  return (
    <div className='hidden mt-28 w-[400px] h-[740px] lg:flex flex-col border-2 border-gray-300 rounded-2xl'>
      {/* Toggle Buttons */}
      <div className='flex items-center justify-center gap-8 py-4 mx-2 mt-4 rounded-[8px] bg-gray-100'>
        <button
          onClick={() => setActiveBtn('addtocart')}
          className={`w-40 h-12 border border-gray-300 rounded-[8px] font-medium text-[18px] cursor-pointer hover:bg-orange-100 ${activeBtn === 'addtocart' ? 'bg-white' : ''}`}
        >
          Add to Cart
        </button>
        <button
          onClick={() => setActiveBtn('deliveryInfo')}
          className={`w-40 h-12 border border-gray-300 rounded-[8px] font-medium text-[18px] cursor-pointer hover:bg-orange-100 ${activeBtn === 'deliveryInfo' ? 'bg-white' : ''}`}
        >
          Delivery Info
        </button>
      </div>

      {/* Cart Items */}
      <div className='overflow-y-auto'>
        {
          activeBtn === 'addtocart' ? <div>
            {items.length > 0 ? (
              <div className='flex flex-col gap-4 mt-4'>
                <p className='text-[20px] font-medium px-2'>Your Items</p>
                <div className='h-[380px] flex flex-col gap-4 overflow-y-auto'>
                  {items.map(item => (
                    <div key={item._id} className='flex items-center px-2'>
                      <img className='size-20 rounded-[10px]' src={`http://localhost:5000/images/${item.image}`} alt="" />
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
                                    className={`text-[22px] ${ orderData?.orderStatus !== 'Delivered' && restaurantId === orderData?.restaurant?._id ? 'cursor-not-allowed' : ''}`}
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

                {/* Summary */}
                <div className='px-2 text-[18px] text-gray-700 font-medium'>
                  <div className='border-b border-gray-200 pb-4'>
                    <p className='flex justify-between items-center'>Subtotal: <span>tk {subtotal}</span></p>
                    <p className='flex justify-between items-center'>Standard delivery: <span>tk {deliveryFee}</span></p>
                  </div>
                  <p className='flex justify-between items-center'>Total: <span>tk {total}</span></p>
                </div>

                {/* Checkout Button */}
                {
                  orderData?.orderStatus !== 'Delivered' && restaurantId === orderData?.restaurant?._id ?
                    <button className='w-[94%] flex items-center justify-center gap-2 m-auto h-12 mt-2 cursor-pointer font-medium text-[18px] bg-gray-300 text-white rounded'>
                      <FaLock /> Order locked
                    </button>
                    :
                    <button
                      onClick={() => {
                        dispatch(setCheckoutDetails({ restaurantData, items }));
                        navigate('/checkout');
                      }}
                      className='w-[94%] m-auto h-12 mt-2 cursor-pointer font-medium text-[18px] bg-orange-600 text-white rounded'
                    >
                      Proceed to Checkout
                    </button>
                }
              </div>
            ) : (
              <div className='w-full h-full flex flex-col items-center justify-center mt-[30%]'>
                <img className='w-30' src={assets.cart_empty} alt="" />
                <p className='font-medium'>Hungry?</p>
                <p className='text-center'>You haven't added anything to <br /> your cart!</p>
              </div>
            )}
          </div>
            :
            <div>
              {
                restaurantId === orderData?.restaurant._id &&
                <div>
                  {
                    orderData?.orderStatus === 'Pending' ?
                      <div className='h-full'>
                        <div className='flex flex-col items-center bg-orange-600 text-white pt-4 pb-10'>
                          <BsClockFill className='text-5xl' />
                          <p className='text-2xl font-semibold'>Order Pending</p>
                          <p>Waiting for rastaurant comfirmation</p>
                          <p className='mt-2 px-4 py-1 rounded-2xl bg-gray-200 text-orange-600 border border-gray-300 font-medium'>Order #FD-2847</p>
                        </div>

                        <div className='bg-white h-[450px] flex flex-col justify-center items-center rounded-2xl border border-gray-200 mt-[-24px] z-10 mx-2 pt-4'>
                          <div className='flex flex-col justify-center items-center text-gray-700'>
                            <Loading />
                            <p className='text-2xl font-bold mb-6'>ORDER PENDING</p>
                            <p className='text-center font-medium'>The restaurant has received your order and is checking availability. This usually takes 1-5 minutes.</p>
                          </div>
                        </div>
                      </div>
                      :
                      <div className='p-4'>
                        {
                          orderData &&
                          <div className=''>
                            <div className='flex flex-col items-center'>
                              <FaCheckCircle className='text-5xl text-green-500' />
                              <p className='text-2xl font-semibold'>Order Confirmed!</p>
                              <p className='flex items-center'>Your food is being <span className='ml-0.5 bg-orange-500 px-2 rounded-2xl text-white'>{orderData?.orderStatus}</span></p>
                              <p className='px-4 py-1.5 rounded-2xl bg-gray-100 font-medium'>Order #FD-2847</p>
                            </div>

                            <div className='flex flex-col gap-2 mt-6'>
                              <div className='flex items-center gap-2'>
                                <GrRestaurant className='text-2xl' />
                                <p className='text-[20px] font-semibold'>Restaurant</p>
                              </div>
                              <div className='flex items-center gap-3 bg-blue-50/50 rounded-2xl py-2 px-1 border-l-6 border-orange-600'>
                                <MdRestaurant className='text-4xl text-orange-600' />
                                <div className=''>
                                  <p className='text-[20px] font-semibold'>{orderData.restaurantName}</p>
                                  <div className='flex items-center flex-wrap gap-2 font-medium text-gray-700'>
                                    <p>{orderData.restaurant.address}</p>
                                    <div className='flex items-center'>
                                      <GoDotFill />
                                      <p className='text-[12px]'>{orderData.restaurant.deliveryTime} mins</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className='mt-8'>
                              <div className='font-semibold text-[18px] pb-2'>
                                <p className='border-b border-gray-200 pb-1'>Delivery Info</p>
                              </div>
                              <div className='flex flex-col gap-3'>
                                <div className='flex gap-2'>
                                  <p className='font-medium'>Address:</p>
                                  <p>{orderData.address.subLocation}</p>
                                </div>
                                <div className='flex gap-2'>
                                  <p className='font-medium'>City:</p>
                                  <p>{orderData.address.city}</p>
                                </div>
                              </div>
                            </div>

                            {
                              orderData?.delivery?.riderName &&
                              <div className='mt-8'>
                                <div className='font-semibold text-[20px] pb-2'>

                                  <p>Rider Info</p>
                                </div>
                                <div className='bg-blue-50/50 p-2 rounded-2xl border border-gray-200'>
                                  <div className='flex justify-between items-center border-b pb-2 border-gray-200'>
                                    <div className='flex items-center gap-2 px-3 py-0.5 rounded-2xl bg-green-600 text-white'>
                                      <FaCheckCircle />
                                      <p className='text-[14px]'>RIDER ASSIGNED</p>
                                    </div>
                                    <div className='flex items-center gap-2 text-amber-500'>
                                      <IoStar className='text-[20px]' />
                                      <p>4.3</p>
                                    </div>
                                  </div>
                                  <div className='flex flex-col gap-2 mt-4'>
                                    <div className='flex items-center gap-2'>
                                      <p className='font-medium'>Name:</p>
                                      <p>{orderData.delivery.riderName}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                      <p className='font-medium'>Phone:</p>
                                      <p>{orderData.delivery.riderPhone}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                      <p className='font-medium'>Delivery completed:</p>
                                      <p>20</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            }

                            <div className='pt-8'>
                              <div className='pb-2'>
                                <p className='text-[18px] font-semibold'>Order Summary</p>
                              </div>
                              <div className='flex flex-col gap-2 bg-blue-50/50 rounded-2xl py-2 px-4 max-h-[300px] overflow-y-auto border border-gray-200'>
                                {
                                  orderData?.items.map(item => (
                                    <div key={item._id} className='flex items-center justify-between border-b border-gray-200 pb-1'>
                                      <div>
                                        <p className='font-semibold'>{item.foodName}</p>
                                        <p className='text-[14px]'>Qty: {item.quantity}</p>
                                      </div>
                                      <p className='text-[20px] font-semibold text-orange-600'>Tk {item.price * item.quantity}</p>
                                    </div>
                                  ))
                                }
                                <div className='flex items-center justify-between'>
                                  <p className='font-semibold'>Delivery Fee:</p>
                                  <p className='text-[20px] font-semibold text-orange-600'>Tk {orderData.restaurant.deliveryFee}</p>
                                </div>
                                <div className='flex items-center justify-between border-t-2 border-gray-300'>
                                  <p className='font-semibold'>Total:</p>
                                  <p className='text-[20px] font-semibold text-orange-600'>Tk {orderData.total}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                  }
                </div>
              }
            </div>
        }
      </div>
    </div>
  );
};

export default AddToCartBox;
