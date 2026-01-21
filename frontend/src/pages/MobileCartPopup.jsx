import React, { useEffect, useState } from 'react'
import { TbShoppingBag } from "react-icons/tb";
import DotLoading from '../Loading/DotLoading/DotLoading';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../Api/axiosInstance';

const MobileCartPopup = () => {
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
  const [showCart, setShowCart] = useState(true)
  const [veiwCartDetails, setViewCartDetails] = useState(false)

  const [orderData, setOrderData] = useState({});


  const navigate = useNavigate()

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


  const handleNavigate = (name) => {
    console.log(name)
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    navigate(`/restaurant/${slug}/cart`)
  }



  return (
    <div className='bg-white'>
      <div>
        {
          showCart &&
          <div className='w-full  bg-white fixed lg:hidden bottom-0 left-0 p-4'>
            <div onClick={() => handleNavigate(restaurantData.restaurantName)} className='grid grid-cols-3 text-end  px-2 bg-orange-600 text-white py-4 rounded-[10px] cursor-pointer'>
              <div className='flex items-center '>
                <TbShoppingBag className='text-3xl' />
                <p className='text-sm'>{items.length}</p>
              </div>
              <p className='font-semibold text-center'>View Cart</p>
              {
                !loading ?
                  <p className='font-semibold'>TK {subtotal}</p>
                  :
                  <DotLoading />
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default MobileCartPopup