import axios from 'axios'
import React, { useEffect } from 'react'
import { GrLocation } from "react-icons/gr";
import { useSelector } from 'react-redux';

const LatestDeliveryAddress = ({ setLatestDeliveryAddress, latestDeliveryAddress, isAddAddress, setDeliveryAddress, editDefaultDeliveryAddress, setEditDefaultDeliveryAddress }) => {


    const userData = useSelector((state) => state.user.userData)

    const getLatestDeliveryAddress = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/profile/data/${userData._id}`)
            if (!isAddAddress) {
                setLatestDeliveryAddress(response.data.data.address[0])
                setDeliveryAddress(response.data.data.address[0])
            } else {
                setLatestDeliveryAddress(response.data.data.address[response.data.data.address.length - 1])
                setDeliveryAddress(response.data.data.address[response.data.data.address.length - 1])
            }
            
        }
        catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getLatestDeliveryAddress()
    }, [])
    return (
        <div className='bg-white p-6'>
            <div className='flex items-center gap-2 text-gray-700'>
                <GrLocation className='text-3xl' />
                <div className='flex flex-col gap-4 font-semibold '>
                    <p className='text-[20px]'>{latestDeliveryAddress?.subLocation}</p>
                    <p className=''>{latestDeliveryAddress?.city || latestDeliveryAddress?.district}</p>
                </div>
            </div>
            <div className='mt-4'>
                <div className="relative">
                    <input
                        type="text"
                        placeholder=' '
                        value={latestDeliveryAddress?.riderNote}
                        className="peer markdown-input text-gray-700 "
                    />
                    <label className="markdown-label">Rider Note</label>
                </div>
            </div>
        </div>
    )
}

export default LatestDeliveryAddress