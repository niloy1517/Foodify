import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { storeContext } from '../Context/Context';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { GrLocation } from "react-icons/gr";
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { axiosInstance } from '../Api/axiosInstance';



const DefaultDeliveryAddress = ({ setOpenMap, setAddNewDeliveryAddress, setIsAddAddress, setEditDefaultDeliveryAddress, setShowSavedAddresses, setDeliveryAddress, latestDeliveryAddress }) => {

    const { coordinates } = useContext(storeContext)
    const { lat, lng } = coordinates;



    const userData = useSelector((state) => state.user.userData)


    const [userAddressData, setUserAddressData] = useState({})


    const getDefaultAddressData = async () => {
        try {
            const response = await axiosInstance.get(`/user/profile/data/${userData._id}`)
            setUserAddressData(response.data.data.address[0])
            setDeliveryAddress(response.data.data.address[0])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDefaultAddressData()
    }, [latestDeliveryAddress])

    if (!userAddressData)
        return <div className='w-full bg-white p-6'>
            <p className='text-[18px] font-semibold pb-2'>Where should we deliver your order?</p>
            <p>Please add your delivery address to continue.</p>
            <button onClick={() => {
                setOpenMap(true);
                setEditDefaultDeliveryAddress(true);
                setAddNewDeliveryAddress(true);
                setIsAddAddress(true)
            }}
                className='mt-4 px-4 py-1 bg-gray-100 rounded font-medium hover:bg-orange-300 cursor-pointer hover:text-white'>
                + Add address
            </button>
        </div>
    return (
        <div className='w-full bg-white p-6'>
            <div className='flex justify-between items-center pb-4'>
                <p className='lg:text-[20px] font-semibold'>Delivery address</p>
                <button onClick={() => { setShowSavedAddresses(true) }} className='text-sm lg:text-[18px] font-medium cursor-pointer text-gray-600'>View Saved Address</button>
            </div>
            <div>
                <MapContainer center={[userAddressData?.location?.coordinates[1] || lat, userAddressData?.location?.coordinates[0] || lng]} zoom={13} className="w-full h-50 relative z-0">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[userAddressData?.location?.coordinates[1] || lat, userAddressData?.location?.coordinates[0] || lng]} />
                </MapContainer>
            </div>
            <div className='flex items-center justify-between my-4 text-gray-600 border-b border-gray-200 pb-2'>
                <div className='flex items-center gap-3'>
                    <GrLocation className='text-3xl' />
                    <div className='flex flex-col'>
                        <p className='lg:text-[20px] font-medium'>{userAddressData?.subLocation}</p>
                        <p className='text-sm md:text-[16px] font-medium'>{userAddressData?.city}</p>
                    </div>
                </div>
                <button onClick={() => { setOpenMap(true), setEditDefaultDeliveryAddress(true) }} className='px-4 py-1.5 bg-gray-300 rounded font-medium cursor-pointer'>Edit</button>
            </div>
            <div className='flex flex-col gap-5'>
                <p className='lg:text-[22px] font-medium text-gray-700'>We're missing your street / house number</p>
                <div className="relative">
                    <input
                        type="text"
                        name='street'
                        placeholder=' '
                        value={userAddressData?.road || userAddressData?.street}

                        className="peer markdown-input"
                    />
                    <label className="markdown-label">Street</label>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        name='apartment'
                        value={userAddressData?.apartment}
                        placeholder=' '
                        className="peer markdown-input"
                    />
                    <label className="markdown-label">Apartment</label>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        name='riderNote'
                        value={userAddressData?.riderNote}
                        placeholder=' '
                        className="peer markdown-input w-[90%] h-22 overflow-y-auto"
                    />
                    <label className="markdown-label">Node to rider - e.g. building, landmark</label>
                </div>
                <div className='py-4'>
                    <p className='text-[20px] font-medium text-gray-700 pb-4'>Add a label</p>
                    <div className='flex items-center gap-3 flex-wrap text-sm md:text-[16px]'>
                        <button className={`flex items-center gap-2 py-1 px-2 md:px-4 border border-gray-200 cursor-pointer rounded-2xl hover:scale-105 transition-transform ${userAddressData?.label == 'home' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-50'}`}><TiHomeOutline /> Home</button>
                        <button className={`flex items-center gap-2 py-1 px-2 md:px-4 border border-gray-200 cursor-pointer rounded-2xl hover:scale-105 transition-transform ${userAddressData?.label == 'work' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-50'}`}><MdOutlineWorkOutline /> Work</button>
                        <button className={`flex items-center gap-2 py-1 px-2 md:px-4 border border-gray-200 cursor-pointer rounded-2xl hover:scale-105 transition-transform ${userAddressData?.label == 'partner' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-50'}`}><FaRegHeart /> Partner</button>
                        <button className={`flex items-center gap-2 py-1 px-2 md:px-4 border border-gray-200 cursor-pointer rounded-2xl hover:scale-105 transition-transform ${userAddressData?.label == 'other' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-50'}`}><IoMdAdd /> Other</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DefaultDeliveryAddress