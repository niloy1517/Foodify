import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../Api/axiosInstance'

const orderDetails = () => {
    const { id } = useParams()


    const [orderDetails, setOrderDetails] = useState({})

    const getOrderDetails = async () => {
        try {
            const response = await axiosInstance.get(`/user/order/details/${id}`)
            setOrderDetails(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getOrderDetails()
    }, [])

    const date_TimeFormat = new Date(orderDetails?.orderTime).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })

    return (
        <div className='w-full h-full overflow-y-auto px-10 shadow'>
            <h1 className='font-semibold text-2xl px-4 py-6 border-b border-gray-200'>Order Details - {orderDetails?.orderId}</h1>

            <div className="pt-8 mx-6">
                <h1 className="font-semibold text-[20px] mb-4 border-b border-gray-200">Order Information</h1>

                <div className="grid grid-cols-[220px_1fr] gap-y-3 text-[17px] text-gray-700">
                    <p>Order ID:</p>
                    <span>{orderDetails.orderId}</span>

                    <p>Order Status:</p>
                    <span className="mr-2">{orderDetails.orderStatus}</span>


                    <p>Order Time:</p>
                    <span>{date_TimeFormat}</span>

                    <p>Payment Method:</p>
                    <span>{orderDetails.gatewayResponse?.card_type}</span>

                    <p>Payment Status:</p>
                    <span>{orderDetails.paymentStatus}</span>
                </div>
            </div>
            <div className='pt-8 mx-6'>
                <h1 className="font-semibold text-[20px] mb-4 border-b border-gray-200">Customer Information</h1>
                <div className='grid grid-cols-[220px_1fr] gap-y-3 text-[17px] text-gray-700'>
                    <p>Name:</p>
                    <span>{orderDetails.customerName}</span>

                    <p>Phone:</p>
                    <span>{orderDetails.phone}</span>

                    <p>Email:</p>
                    <span>{orderDetails.email}</span>

                    <p>Delivery Address:</p>
                    <span>{orderDetails.address?.subLocation}</span>

                    <p>Instructions:</p>
                    <span>{orderDetails.riderNote}</span>
                </div>
            </div>
            <div className='pt-8 mx-6'>
                <h1 className="font-semibold text-[20px] mb-4 border-b border-gray-200">Restaurant Information</h1>

                <div className='grid grid-cols-[220px_1fr] gap-y-3 text-[17px] text-gray-700'>
                    <p>Name:</p>
                    <span>{orderDetails.restaurantName}</span>

                    <p>Phone</p>
                    <span>{orderDetails.restaurant?.phone}</span>

                    <p>Address</p>
                    <span>{orderDetails.restaurant?.address}</span>

                    <p>Delivery Time</p>
                    <span>{orderDetails.restaurant?.deliveryTime} min</span>
                </div>
            </div>
            <div className='pt-8 mx-6'>
                <h1 className="font-semibold text-[20px] mb-4 border-b border-gray-200">Order Items</h1>
                <div className='flex flex-col gap-4 text-[17px] text-gray-700'>
                    {
                        orderDetails.items?.map(item => (
                            <div key={item._id} className='flex justify-between border-b border-gray-200'>
                                <div className='flex gap-2'>
                                    <p>{item.quantity}</p>
                                    <p>x</p>
                                    <p>{item.foodName}</p>
                                </div>
                                <span>Tk {item.price}</span>
                            </div>
                        ))
                    }
                </div>
                <div className='flex justify-between items-center pt-4 text-[17px] text-gray-700'>
                    <p>Delivery Fee:</p>
                    <p>Tk {orderDetails.restaurant?.deliveryFee}</p>
                </div>
                <div className='flex justify-between items-center mt-4 border-t-3 border-gray-200 font-semibold'>
                    <p>Total:</p>
                    <p>Tk {orderDetails.total}</p>
                </div>
            </div>
            <div className='py-8 mx-6 mb-40'>
                <h1 className="font-semibold text-[20px] mb-4 border-b border-gray-200">Delivery Information</h1>
                <div className='grid grid-cols-[220px_1fr] gap-y-3 text-[17px] text-gray-700'>
                    <p>Diver Name:</p>
                    <span></span>

                    <p>Diver Phone:</p>
                    <span></span>

                    <p>Delivery start: </p>
                    <span></span>

                    <p>Delivery end: </p>
                    <span></span>
                </div>
            </div>
        </div>
    )
}

export default orderDetails