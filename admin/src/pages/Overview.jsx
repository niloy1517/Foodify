import React, { useEffect, useState } from 'react'
import { IoIosInformationCircle } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import axios from 'axios';
import { useParams } from 'react-router-dom';
const Overview = () => {
    axios.defaults.withCredentials = true;
    const {id} = useParams();
    
    const [restaurant, setRestaurant] = useState('')
    const [cuisinesArray, setCuisinesArray] = useState([])
      const {
      restaurantName,
      ownerName,
      email,
      phone,
      description,
      address,
      city,
      zipcode,
      deliveryRadius,
      deliveryTime,
      deliveryFee,
      openingTime,
      closingTime} = restaurant;

        const restaurantData = async () => {
            try {
            const response = await axios.post(`http://localhost:5000/api/restaurant/details`, {id}, {withCredentials: true})
            setRestaurant(response.data.data)
            if(response.data.data) {
                setCuisinesArray(JSON.parse(response.data.data.cuisines))
            }
            } catch (error) {
            console.log(error)
            }
        }
        
        useEffect(() => {
            restaurantData()
        }, [])
  return (
    <div>
        <div className='flex flex-col gap-10'>
              <div className='shadow rounded-[10px] px-10'>
                <div className='flex items-center justify-between font-medium text-gray-700 pt-6 border-b border-gray-200 pb-2'>
                  <p className='flex items-center gap-2 text-2xl'><IoIosInformationCircle className='text-3xl text-orange-600' /> Basic Information</p>
                  <button className='flex items-center gap-2 text-orange-600'><FiEdit /> Edit</button>
                </div>
                <div className='flex flex-col gap-3 py-6 text-gray-600 text-[18px]'>
                  <p>Restaurant Name: <span className='text-[17px] text-gray-800 font-medium'>{restaurantName}</span></p>
                  <p>Owner Name: <span className='text-[17px] text-gray-800 font-medium'>{ownerName}</span></p>
                  <p>Email: <span className='text-[17px] text-gray-800 font-medium'>{email}</span></p>
                  <p>Phone: <span className='text-[17px] text-gray-800 font-medium'>{phone}</span></p>
                  <p>Description: <span className='text-[17px] text-gray-800 font-medium'>{description}</span></p>
                  <p>Delivery Time: <span className='text-[17px] text-gray-800 font-medium'>{deliveryTime} minutes</span></p>
                  <p>Delivery Fee: <span className='text-[17px] text-gray-800 font-medium'>{deliveryFee} tk</span></p>
                  <p>Opening Time: <span className='text-[17px] text-gray-800 font-medium'>{openingTime}</span></p>
                  <p>Closing Time: <span className='text-[17px] text-gray-800 font-medium'>{closingTime}</span></p>
                </div>
              </div>
              <div className='shadow rounded-[10px] px-10'>
                <div className='flex items-center justify-between font-medium text-gray-700 pt-6 border-b border-gray-200 pb-2'>
                  <p className='flex items-center gap-2 text-2xl'><MdLocationOn className='text-3xl text-orange-600' /> Location Information</p>
                  <button className='flex items-center gap-2 text-orange-600'><FiEdit /> Edit</button>
                </div>
                <div className='flex flex-col gap-3 py-6 text-gray-600 text-[18px]'>
                  <p>Address: <span className='text-[17px] text-gray-800 font-medium'>{address}</span></p>
                  <p>City: <span className='text-[17px] text-gray-800 font-medium'>{city}</span></p>
                  <p>ZIP code: <span className='text-[17px] text-gray-800 font-medium'>{zipcode}</span></p>
                  <p>Delivery Redius: <span className='text-[17px] text-gray-800 font-medium'>{deliveryRadius} km</span></p>
                </div>
              </div>
            </div>
    </div>
  )
}

export default Overview