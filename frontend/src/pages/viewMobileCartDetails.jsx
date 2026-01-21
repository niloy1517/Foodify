import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { decrement, increment, deleteToCart, setCheckoutDetails } from '../Service/Redux/Slice/AddToCartItemSlice';
import { useNavigate } from 'react-router-dom';
import { storeContext } from '../Context/Context';
import { axiosInstance } from '../Api/axiosInstance';

const viewMobileCartDetails = () => {
    const {setLoginPopup, setShowAuthenticationPopup} = useContext(storeContext)
    const carts = useSelector((state) => state.cart.carts);
    const restaurantId = useSelector((state) => state.restaurant.restaurantId);
    const restaurantData = useSelector((state) => state.restaurant.restaurantData);
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

    const [loading, setLoading] = useState(false)

    const [activeBtn, setActiveBtn] = useState('delivery');
    const [orderData, setOrderData] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleNavigate = (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        navigate(`/restaurant/${slug}/`)
    }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            console.log('loading...')
        }, 2000)

    }, [items])

    const getOrderData = async () => {
        try {
            const response = await axiosInstance.get(`/user/order/list/${userData?._id}`)
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
        <div className='w-full h-screen overflow-y-auto flex flex-col'>

            <div className='flex justify-between px-4 pt-6 pb-2 border-b border-gray-200'>
                <div className='text-gray-700'>
                    <p className='text-2xl font-semibold'>Cart</p>
                    <p>Moduban</p>
                </div>
                <button onClick={() => handleNavigate(restaurantData.restaurantName)} className='w-10 h-10 flex justify-center items-center rounded-full shadow hover:bg-gray-100 cursor-pointer transition duration-200'>
                    <RxCross2 className='text-2xl text-gray-600' />
                </button>
            </div>

            <div>
                {
                    items.length !== 0 ?
                        <div>
                           

                            <div className='h-full flex flex-col justify-between'>

                                <div className='overflow-y-auto h-[600px] py-4'>
                                    {
                                        items.length > 0 &&
                                        <div className='px-4'>
                                            <p className='text-[20px] font-semibold px-2 pb-4'>Your Items</p>
                                            <div className='flex flex-col gap-4'>
                                                {items.map(item => (
                                                    <div key={item._id} className='flex items-center border-b border-gray-200 pb-2'>
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
                                                                                    className={`text-[22px] ${orderData?.orderStatus !== 'Delivered' && restaurantId === orderData?.restaurant?._id ? 'cursor-not-allowed' : ''}`}
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
                                            <button onClick={() => handleNavigate(restaurantData.restaurantName)} className='flex items-center text-gray-700 cursor-pointer py-3'>
                                                <IoIosAdd className='text-4xl' />
                                                <p className='font-semibold text-[18px]'>Add more items</p>
                                            </button>
                                        </div>
                                    }
                                </div>


                                <div className='px-4 py-4'>
                                    {/* Summary */}
                                    <div className='text-[18px] text-gray-700 font-medium bg-white'>
                                        <div className='border-b border-gray-200 pb-4'>
                                            <p className='flex justify-between items-center'>Subtotal: <span>tk {subtotal}</span></p>
                                            <p className='flex justify-between items-center'>Standard delivery: <span>tk {deliveryFee}</span></p>
                                        </div>
                                        <p className='flex justify-between items-center'>Total: <span>tk {total}</span></p>
                                    </div>

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
                                </div>
                            </div>
                        </div>
                        :
                        <div className='w-full h-full flex flex-col items-center justify-center mt-[25%]'>
                            <img className='w-30' src={assets.cart_empty} alt="" />
                            <p className='font-medium'>Hungry?</p>
                            <p className='text-center'>You haven't added anything to <br /> your cart!</p>
                        </div>
                }
            </div>
        </div>
    )
}

export default viewMobileCartDetails