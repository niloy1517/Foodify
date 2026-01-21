import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GrLocation } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from 'react-toastify';
import { axiosInstance } from '../Api/axiosInstance';

const ViewSavedDeliveryAddress = ({setOpenMap, setEditDefaultDeliveryAddress, setShowSavedAddresses, setAddNewDeliveryAddress, setDeliveryAddress, setIsAddAddress }) => {
    const [saveAddressList, setSaveAddressList] = useState([])
   
    const [selectedAddress, setSelectedAddress] = useState('')
    
    const userData = useSelector((state) => state.user.userData)

    const getDeliveryAddressList = async () => {
        try {
            const response = await axiosInstance.get(`api/user/profile/data/${userData._id}`)
            setSaveAddressList(response.data.data.address)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteDeliveryAddress = async (addressId) => {
        try {
            const response = await axiosInstance.delete(`/user/delivery/address/delete/${addressId}`,
                {
                    data: { userId: userData._id },
                    withCredentials: true
                })
            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }


    useEffect(() => {
        getDeliveryAddressList()
    }, [])
    return (
        <div className='w-full bg-white p-4 lg:p-6 flex flex-col gap-4'>
            {saveAddressList.map(address => (
                <div className={`p-3 rounded-2xl flex items-center gap-3 ${selectedAddress == address._id ? 'border-3 border-gray-500' : 'border border-gray-200'}`}>
                    <div>
                        <input
                            type="radio"
                            name="address"
                            id=""
                            onClick={() => { setSelectedAddress(address._id), setDeliveryAddress(address) }}
                            checked={selectedAddress == address._id}
                            className='w-6 h-6 cursor-pointer accent-orange-600'
                        />
                    </div>
                    <div className='w-full'>
                        <div className='w-full flex justify-between'>
                            <div className='flex items-center gap-2'>
                                <GrLocation className='text-2xl lg:text-3xl' />
                                <div className='flex flex-col gap-2 font-semibold '>
                                    <p className='md:text-[18px] flex flex-wrap'>{address.subLocation}</p>
                                    <p className='text-sm md:text-[16px]'>{address.district}</p>
                                </div>
                            </div>
                            <AiOutlineDelete onClick={() => deleteDeliveryAddress(address._id)} className='text-2xl cursor-pointer ' />
                        </div>
                        <div className='mt-4'>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder=' '
                                    value={address.riderNote}
                                    className="peer markdown-input text-gray-700 "
                                />
                                <label className="markdown-label">Rider Note</label>
                            </div>
                        </div>
                    </div>
                </div>

            ))
            }
            <button onClick={() => { setOpenMap(true), setEditDefaultDeliveryAddress(true), setAddNewDeliveryAddress(true), setShowSavedAddresses(false), setIsAddAddress(true) }} className='px-4 py-1.5 hover:bg-gray-50 rounded cursor-pointer mt-4 border border-gray-100'>Add new address</button>
        </div>
    )
}

export default ViewSavedDeliveryAddress