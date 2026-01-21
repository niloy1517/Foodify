import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { GoClock } from "react-icons/go";
import { GrRestaurant } from "react-icons/gr";
import { GiGymBag } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { MdAccountCircle } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify'
import { axiosInstance } from '../Api/axiosInstance'



const OrderEdit = () => {
    const { id } = useParams()

    const [orderDetails, setOrderDetails] = useState({})

    const [updateOrderData, setUpdateOrderData] = useState({
        orderStatus: '',
        estimatedDeliveryTime: '',
    })

    const [delivery, setDelivery] = useState({
        riderName: '',
        riderPhone: '',
        deliveryStartAt: '',
        deliveryEndAt: ''
    })


    
    const handleOrderOnchange = (e) => {
        setUpdateOrderData({ ...updateOrderData, [e.target.name]: e.target.value })
    }

    const handleDeliveryOnchange = (e) => {
        setDelivery({ ...delivery, [e.target.name]: e.target.value })
    }



    const getOrderDetails = async () => {
        try {
            const response = await axiosInstance.get(`/user/order/details/${id}`)
            setOrderDetails(response.data.data)
            setUpdateOrderData(response.data.data)
            setDelivery(response.data.data.delivery)
        } catch (error) {
            console.log(error)
        }
    }

    const updateOrder = async () => {
        const payload = {
            orderId: orderDetails._id,
            updateOrderData,
            delivery
        }
        console.log(payload)
        try {
            const response = await axiosInstance.post(`/user/order/status`, payload, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        getOrderDetails()
    }, [])

    const date_TimeFormat = new Date((orderDetails.orderTime)).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
    return (
        <div className='py-8 px-6 h-full overflow-y-auto bg-blue-50/20'>
            <div className='flex flex-col gap-4 border-b border-gray-200 pb-2 text-gray-700'>
                <h1 className='text-2xl font-semibold'>Order ID {orderDetails.orderId}</h1>
                <div className='flex items-center gap-8 text-[17px] font-medium'>
                    <div className='flex items-center gap-2'>
                        <GoClock />
                        <p>Placed: {date_TimeFormat}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <GrRestaurant />
                        <p>{orderDetails.restaurantName}</p>
                    </div>
                    <p className='px-4 py-1 rounded-2xl bg-orange-600/80 text-white'>{orderDetails.orderStatus}</p>
                </div>
            </div>
            <div className='flex flex-col gap-10 py-10'>
                <div className='w-full h-auto flex flex-col gap-8 shadow py-8 px-4 rounded-2xl bg-white'>
                    <div className='flex items-center gap-2 pb-2 border-b-2 border-orange-600 '>
                        <GiGymBag className='text-2xl text-orange-600' />
                        <p className='text-[18px] font-semibold'>Order Items</p>
                    </div>
                    <div className='flex flex-col gap-4'>
                        {
                            orderDetails?.items?.map(item => (
                                <div key={item._id} className='flex items-center justify-between border border-gray-200 py-4 px-6 rounded-[10px] bg-blue-50/20 font-semibold'>
                                    <p className='text-[18px]'>{item.foodName}</p>
                                    <div className='flex items-end flex-col gap-3'>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Tk {item.price}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='w-full h-auto flex flex-col gap-8 shadow py-8 px-4 rounded-2xl bg-white'>
                    <div className='flex items-center gap-2 pb-2 border-b-2 border-orange-600 '>
                        <MdAccountCircle className='text-2xl text-orange-600' />
                        <p className='text-[18px] font-semibold'>Customer Information</p>
                    </div>

                    <div className='flex flex-col gap-4 text-gray-700'>
                        <div className='flex flex-col gap-2'>
                            <p className='font-medium'>Customer Name</p>
                            <p className='border border-gray-200 px-4 py-3 rounded-[8px] bg-blue-50/20'>{orderDetails.customerName}</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-medium'>Phone Number</p>
                            <p className='border border-gray-200 px-4 py-3 rounded-[8px] bg-blue-50/20'>{orderDetails.phone}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Email Address</p>
                            <p className='border border-gray-200 px-4 py-3 rounded-[8px] bg-blue-50/20'>{orderDetails.email}</p>
                        </div>
                        <div>
                            <p className='font-medium'>Delivery Address</p>
                            <p className='border border-gray-200 px-4 py-3 rounded-[8px] bg-blue-50/20'>{orderDetails.address?.subLocation}</p>
                        </div>
                    </div>
                </div>
                <div className='w-full h-auto flex flex-col gap-8 shadow py-8 px-4 rounded-2xl bg-white'>
                    <h1 className='text-[18px] font-semibold'>Rider Information</h1>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="riderName" className='font-medium'>Name</label>
                            <input
                                type="text"
                                name='riderName'
                                id='riderName'
                                placeholder='Enter rider name'
                                value={delivery.riderName}
                                onChange={handleDeliveryOnchange}
                                className='w-full h-14 px-4 outline-0 border border-gray-200 rounded-[8px]'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="riderPhone" className='font-medium'>Phone</label>
                            <input
                                type="text"
                                name='riderPhone'
                                id='riderPhone'
                                placeholder='Enter rider phone'
                                value={delivery.riderPhone}
                                onChange={handleDeliveryOnchange}
                                className='w-full h-14 px-4 outline-0 border border-gray-200 rounded-[8px]'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="deliveryStartAt" className='font-medium'>Delivery start at</label>
                            <input
                                type="time"
                                name='deliveryStartAt'
                                id='deliveryStartAt'
                                value={delivery.deliveryStartAt}
                                onChange={handleDeliveryOnchange}
                                className='w-full h-14 px-4 outline-0 border border-gray-200 rounded-[8px]'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="deliveryEndAt" className='font-medium'>Delivery end at</label>
                            <input
                                type="time"
                                name='deliveryEndAt'
                                id='deliveryEndAt'
                                value={delivery.deliveryEndAt}
                                onChange={handleDeliveryOnchange}
                                className='w-full h-14 px-4 outline-0 border border-gray-200 rounded-[8px]'
                            />
                        </div>
                    </div>

                    <div className='flex items-center gap-2 pb-2 border-b-2 border-orange-600 '>
                        <TbTruckDelivery className='text-2xl text-orange-600' />
                        <p className='text-[18px] font-semibold'>Delivery Management</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="" className='font-medium'>Delivery Status</label>
                        <select name="orderStatus" id="" value={updateOrderData.orderStatus} onChange={handleOrderOnchange}
                            className='outline-0 border border-gray-200 px-4 py-3 rounded-[8px]'>
                            <option value="Pending">Pending</option>
                            <option value="Confirm">Confimed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="On the way">On the way</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancle">Cancle</option>
                        </select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='font-medium'>Estimated Delivery Time</p>
                        <input
                            type="datetime-local"
                            name="estimatedDeliveryTime"
                            id=""
                            value={updateOrderData.estimatedDeliveryTime}
                            onChange={handleOrderOnchange}
                            className='outline-0 border border-gray-200 px-4 py-3 rounded-[8px]'
                        />
                    </div>
                    <button
                        onClick={updateOrder}
                        className='px-4 py-2 bg-orange-600 text-white rounded-[8px] cursor-pointer'
                    >Change Delivery Info</button>
                </div>
                <div className='w-full h-auto flex flex-col gap-8 shadow py-8 px-4 rounded-2xl bg-white font-medium text-gray-700'>
                    <div className='flex justify-between items-center border-b-2 border-orange-600 pb-2'>
                        <p className='text-2xl font-semibold'>Order Summary</p>
                        <div className='flex flex-col gap-3 items-end'>
                            <p className='text-orange-600 font-bold text-2xl'>Tk {orderDetails.total}</p>
                            <p>Total Amount</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                        {
                            orderDetails?.items?.map(item => (
                                <div className='flex items-center justify-between border-b border-gray-200 pb-2'>
                                    <p className='text-[18px]'>{item.foodName}</p>
                                    <div className='flex flex-col gap-3 items-end'>
                                        <p>x {item.quantity}</p>
                                        <p>Tk {item.price}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='bg-blue-50/30 flex flex-col gap-4 py-4 px-6 rounded-[10px] shadow'>
                        <div className='flex justify-between items-end'>
                            <p>Subtotal</p>
                            <p>Tk {orderDetails.subtotal}</p>
                        </div>
                        <div className='flex justify-between items-end'>
                            <p>Delivery Fee</p>
                            <p>Tk {orderDetails?.restaurant?.deliveryFee}</p>
                        </div>
                        <div className='flex justify-between items-end pt-2 border-t border-gray-200 text-[20px] font-semibold text-orange-600'>
                            <p>Total</p>
                            <p>Tk {orderDetails.total}</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-4 py-4 px-6 bg-white shadow rounded-2xl font-semibold text-gray-700'>
                    <h1 className='text-[18px] font-semibold border-b-2 border-orange-600 pb-2'>Payment Information</h1>
                    <div className='flex items-center justify-between'>
                        <p>Payment Method</p>
                        <p>{orderDetails?.gatewayResponse?.card_type}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p>Payment Status</p>
                        <p>{orderDetails.paymentStatus}</p>
                    </div>
                </div>
                <div className='mb-50'>
                    <h1 className='text-2xl font-semibold pb-8'>Order status timeline</h1>
                    <div className='flex items-center gap-8'>
                        <p className='px-3 py-1 rounded-2xl bg-white shadow'>Order Placed</p>
                        <p className={`px-3 py-1 rounded-2xl shadow ${orderDetails.orderStatus === 'Pending' ? 'bg-green-600 text-white' : 'bg-white'}`}>Pending</p>
                        <p className={`px-3 py-1 rounded-2xl shadow ${orderDetails.orderStatus === 'Accept' ? 'bg-green-600 text-white' : 'bg-white'}`}>Accept</p>
                        <p className={`px-3 py-1 rounded-2xl shadow ${orderDetails.orderStatus === 'Preparing' ? 'bg-green-600 text-white' : 'bg-white'}`}>Preparing</p>
                        <p className={`px-3 py-1 rounded-2xl shadow ${orderDetails.orderStatus === 'On the way' ? 'bg-green-600 text-white' : 'bg-white'}`}>On the way</p>
                        <p className={`px-3 py-1 rounded-2xl shadow ${orderDetails.orderStatus === 'Delivered' ? 'bg-green-600 text-white' : 'bg-white'}`}>Delivered</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderEdit