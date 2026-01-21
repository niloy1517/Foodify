import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import { axiosInstance } from '../Api/axiosInstance'

const PaymentSuccessfull = () => {
  const { id } = useParams()
  const tranId = id;

  const [order, setOrder] = useState({})

  const navigate = useNavigate()

  const getOrderPaymentData = async () => {
    try {
      const response = await axiosInstance.get(`/payment/order/details/${tranId}`)
      setOrder(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }



  const Date_TimeFormat = new Date(order?.paymentDate).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  useEffect(() => {
    getOrderPaymentData()
  }, [])

  const defaultLocation = JSON.parse(localStorage.getItem('defaultLocation'))

  const handleNavigate = () => {
    navigate(`/restaurants/new?lat=${defaultLocation?.lat}&lng=${defaultLocation?.lon}`)
  }

  return (
    <div className='w-full flex justify-center '>
      <div className='w-[550px] shadow-2xl py-10 rounded-2xl my-26'>
        <div className='w-full flex flex-col justify-center items-center'>
          <img className='w-20' src={assets.payment_success} alt="" />
          <h1 className='text-2xl font-semibold text-green-500'>Payment Successful</h1>
          <p className='text-center flex-wrap pt-4 text-[17px] px-10'>Thank you for your purchase. Your payment has been processed successfully.</p>
        </div>

        <div className='w-full flex flex-col gap-3 text-[18px] font-semibold text-gray-700 p-10'>
          <p className='flex justify-between'>Transaction ID <span>{order.transactionId}</span></p>
          <p className='flex justify-between'>Payment Method <span>{order.gatewayResponse?.card_type}</span></p>
          <p className='flex justify-between'>Mobile <span>{order.phone}</span></p>
          <p className='flex justify-between'>Date & Time <span>{Date_TimeFormat}</span></p>
          <br />
          <p className='flex justify-between'>Amount Paid <span>Tk  {order.gatewayResponse?.amount}</span></p>
        </div>
        <div className='flex justify-center items-center gap-10 text-[18px] font-semibold'>
          <button className='py-2 px-10 rounded cursor-pointer bg-orange-600 text-white'>Download Receipt</button>
          <button onClick={handleNavigate} className='py-2 px-10 rounded cursor-pointer bg-gray-600 text-white'>Back to Home</button>
        </div>
        <p className='text-center font-medium text-gray-500 mx-4 flex-wrap text-[14px] pt-4 border-t border-gray-200 mt-8'>Your order will be processed within 10 minutes. A confirmation email has been sent to customer@example.com. For any questions, <a href="#" className='hover:text-blue-500'>contact our support team</a>.</p>
      </div>
    </div>
  )
}

export default PaymentSuccessfull