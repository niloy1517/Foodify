import React, { useState } from 'react'
import { LuLocateFixed } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import { useContext } from 'react';
import { storeContext } from '../Context/Context';
import axios from 'axios';

const FindFoodByLocationPopup = () => {
    const { locateLocation, address, setAddress } = useContext(storeContext)

    const handleOnchange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value })
    }

    const [query, setQuery] = useState('')
    const [places, setPlaces] = useState([])

    const handleSearchLocation = async (event) => {
        const searchTerm = event.target.value;
        setQuery(searchTerm)

        if (searchTerm.length > 2) {
            try {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
                    params: {
                        query: searchTerm,
                        key: 'AIzaSyDwO-ua36NJArcvdqp9l1-fnP8Yxm1MaZs'
                    }
                })
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className='w-full flex justify-center px-4'>
            <div className='w-[300px] bg-amber-100 p-4 rounded flex gap-3'>
                <div className='h-12 px-4 flex items-center justify-between border border-gray-200 '>
                    <input
                        type="text"
                        name='address'
                        placeholder='Enter your address'
                        className='border-0 outline-0'
                    />
                    <button className='flex items-center hover:text-orange-600 gap-2'>
                        <LuLocateFixed className='text-orange-600 text-[22px]' />
                        <p>Locate me</p>
                    </button>
                </div>
                <button className='bg-orange-600 px-4 text-white text-[22px] rounded'>
                    <FaArrowRight />
                </button>
            </div>
        </div >
    )
}

export default FindFoodByLocationPopup