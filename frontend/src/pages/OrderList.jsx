import React, { useEffect, useState } from 'react'
import { FaRegCalendar } from "react-icons/fa6";
import { GrRestaurant } from "react-icons/gr";
import { IoStarOutline } from "react-icons/io5";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { TbReload } from "react-icons/tb";
import { useSelector } from 'react-redux';
import { axiosInstance } from '../Api/axiosInstance';

const OrderList = () => {
    const [orderList, setOrderList] = useState([])


    const userData = useSelector((state) => state.user.userData)

    const getUserOrderList = async () => {
        try {
            const response = await axiosInstance.get(`/user/order/list/${userData._id}`);
            setOrderList(response.data.data.reverse());
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserOrderList()
    }, [])

    const statusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-700 border border-yellow-300";
            case "On the way":
                return "bg-blue-100 text-blue-700 border border-blue-300";
            case "Delivered":
                return "bg-green-100 text-green-700 border border-green-300";
            case "Cancel":
                return "bg-red-100 text-red-700 border border-red-300";
            default:
                return "bg-gray-200 text-gray-700";
        }
    }



    return (
        <div className="max-w-5xl mx-auto py-6 px-3">
            {
                orderList.length > 0 ?
                <div>
                <h1 className="text-3xl font-semibold mb-6">Your Order Summary</h1>

                <div className="flex flex-col space-y-6">
                    {orderList.map((order, idx) => (
                        <div
                            key={idx}

                            className="w-full rounded-2xl shadow-md border border-gray-200 p-6 bg-white"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
                                <div>
                                    <p className="text-xl font-semibold">Order {order.orderId}</p>

                                    <div className="flex flex-wrap gap-6 mt-3 text-gray-700 text-[17px]">
                                        <p className="flex items-center gap-2">
                                            <FaRegCalendar /> {new Date(order.orderTime).toLocaleString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <GrRestaurant /> {order.restaurantName}
                                        </p>
                                    </div>
                                </div>

                                <span className={`${statusColor(order.orderStatus)} px-5 py-2 rounded-full text-[16px] font-medium`}>
                                    {order.orderStatus}
                                </span>
                            </div>

                            {/* Items & Price */}
                            <div className="flex flex-col lg:flex-row justify-between gap-8">

                                {/* Items */}
                                <div className="flex flex-col gap-6 flex-1">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    className="size-20 rounded-xl object-cover"
                                                    src={`http://localhost:5000/images/${item.image}`}
                                                    alt=""
                                                />
                                                <div>
                                                    <p className="text-xl font-medium">{item.name}</p>
                                                    <p className="text-gray-600">Tk {item.price * item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium text-gray-700">x {item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="flex-1 flex flex-col gap-2 bg-gray-50 rounded-xl p-5 border border-gray-300">
                                    <div>
                                        <p className="text-lg font-medium mb-4">Payment Summary</p>
                                        <div className="space-y-2 text-gray-700">
                                            <p className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span>Tk {order.subtotal}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span>Delivery Fee</span>
                                                <span>Tk {order.deliveryFee}</span>
                                            </p>
                                            <p className="flex justify-between font-semibold text-[18px] pt-2 border-t border-gray-300">
                                                <span>Total</span>
                                                <span>Tk {order.total}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium mb-4">Billing Address</p>
                                        <div className='flex justify-between items-center text-gray-700'>
                                            <p>Payment Method</p>
                                            <p className='font-medium'>{order?.gatewayResponse?.card_type}</p>
                                        </div>
                                        <div className='flex justify-between items-center text-gray-700'>
                                            <p>Pay Address</p>
                                            <p>{order?.gatewayResponse?.phone || order.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-300">
                                <button className="flex items-center gap-2 px-5 py-2 bg-blue-100 text-blue-700 font-medium rounded-xl hover:bg-blue-200 cursor-pointer">
                                    <TbReload /> Reorder
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 cursor-pointer">
                                    <LiaFileInvoiceSolid /> Invoice
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2 bg-yellow-100 text-yellow-700 font-medium rounded-xl hover:bg-yellow-200 cursor-pointer">
                                    <IoStarOutline /> Rate Order
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            :
            <div className='text-center text-2xl font-semibold mt-10'>No order found</div>
            }
        </div>
    )
}

export default OrderList
