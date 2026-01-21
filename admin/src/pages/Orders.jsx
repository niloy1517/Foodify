import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";

import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../Api/axiosInstance';

const Orders = () => {
  const tableHearder = ['Order ID', 'Customer', 'Restaurant', 'Items', 'Total', 'Status', 'Order Time', 'Action']

  const [orderList, setOrderList] = useState([])
  const [showButtons, setShowButtons] = useState(null)


  const navigate = useNavigate()

  axios.defaults.withCredentials = true;

  const getUserOrderList = async () => {
    try {
      const response = await axiosInstance.get(`/user/order/list`)
      setOrderList(response.data.data.reverse())
    } catch (error) {
      console.log(error)
    }
  }


  const controlOrderStatus = async (orderId, orderStatus) => {
    const payload = {
      orderId,
      orderStatus
    }
    console.log(payload)
    try {
      const response = await axiosInstance.post(`/user/order/status`, payload, { withCredentials: true })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserOrderList()
  }, [controlOrderStatus])

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
    <div className="px-4 py-6 ">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Foods Order List</h1>
      <div className="w-full mx-auto bg-white shadow">
        <div className="px-6 py-4 text-gray-700 shadow">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <p className="pt-2 text-sm text-gray-500">Showing 1-10 of 100 orders</p>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 font-medium text-gray-700">
            <tr>
              {tableHearder.map((header, index) => (
                <th key={index} className="py-4 px-6 font-semibold text-[18px]">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr key={order.orderId} className="border-t border-gray-300">
                <td className="py-3 px-6 font-medium text-gray-800">{order.orderId}</td>
                <td className="py-3 px-6">{order.customerName}</td>
                <td className="py-3 px-6">{order.restaurantName}</td>
                <td className="py-3 px-6">{order.items.length} Items</td>
                <td className="py-3 px-6">Tk {order.total}</td>
                <td className="py-3 px-6">
                  <span className={`${statusColor(order.orderStatus)} py-1 px-3 rounded-2xl`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="py-3 px-6">
                  {new Date(order.orderTime).toLocaleString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </td>
                <td className="px-6">
                  <BsThreeDots
                    className="relative p-2 text-gray-600 border border-gray-300 size-10 rounded-full cursor-pointer hover:bg-gray-100"
                    onMouseEnter={() => setShowButtons(order.orderId)}
                    onMouseLeave={() => setShowButtons(null)}
                  />
                  {
                    showButtons === order.orderId && (
                      <div onMouseEnter={() => setShowButtons(order.orderId)} onMouseLeave={() => setShowButtons(null)} className='absolute right-20 z-20 flex flex-col gap-3 bg-gray-50 rounded'>
                        <button onClick={() => navigate(`/order/details/${order._id}`)} className='flex items-center cursor-pointer gap-2 py-1 px-3 hover:bg-gray-100'><FaRegEye className='' /> View Details</button>
                        <button onClick={() => navigate(`/order/details/edit/${order._id}`)} className='flex items-center cursor-pointer gap-2 py-1 px-3 hover:bg-gray-100'><FiEdit /> Edit Order</button>
                        <button onClick={() => { controlOrderStatus(order._id, 'Confirmed') }} className='flex items-center cursor-pointer gap-2 py-1 px-3 hover:bg-gray-100'><IoIosCheckmarkCircleOutline className='text-[20px]' /> Confimed Order</button>
                        <button onClick={() => { controlOrderStatus(order._id, 'Cancle') }} className='flex items-center cursor-pointer gap-2 py-1 px-3 hover:bg-gray-100'><IoIosCloseCircleOutline className='text-[20px]' /> Cancle Order</button>
                      </div>)
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Orders
