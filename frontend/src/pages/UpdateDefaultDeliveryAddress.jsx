import React from 'react'
import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { storeContext } from '../Context/Context';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { GrLocation } from "react-icons/gr";
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { setNewDeliveryAddress } from '../Service/Redux/Slice/UserDataSlice';


const UpdateDefaultDeliveryAddress = ({ editDefaultDeliveryAddress, isAddNewDeliveryAddress, setShowLatestDeliveryAddress, isAddAddress, setIsAddAddress, setLatestDeliveryAddress }) => {
    const { coordinates } = useContext(storeContext)
    const { lat, lng } = coordinates;

    const [openMap, setOpenMap] = useState(false)
    const [selectedLabel, setSelectedLabel] = useState('')
    const [savedAddress, setSavedAddress] = useState(false)


    const userData = useSelector((state) => state.user.userData)


    const newDeliveryAddress = useSelector((state) => state.user.newDeliveryAddress)

    const dispatch = useDispatch()

    const handleOnChange = (e) => {
        dispatch(setNewDeliveryAddress({ ...newDeliveryAddress, [e.target.name]: e.target.value }))
    }


    const updateDefaultDelieryAddress = async () => {
        try {
            const payload = {
                ...newDeliveryAddress,
                userId: userData._id,
                label: selectedLabel || ''
            }
            const response = await axios.put(`http://localhost:5000/api/user/update/delivery/address`, payload, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                setSavedAddress(true)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }


    const addNewDeliveryAddress = async () => {
        try {
            const payload = {
                ...newDeliveryAddress,
                userId: userData._id,
                label: selectedLabel || ''
            }
            const response = await axios.post(`http://localhost:5000/api/user/delivery/address/add`, payload, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                setSavedAddress(true)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    return (
        <div className='w-full p-6'>
            <div>
                <MapContainer center={[lat, lng]} zoom={13} className="w-full h-50 relative z-0">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[lat, lng]} />
                </MapContainer>
            </div>
            <div className='flex items-center justify-between gap-4 my-4 text-gray-600 border-b border-gray-200 pb-2'>
                <div className='flex items-center gap-3'>
                    <GrLocation className='text-3xl' />
                    <div className='flex flex-col'>
                        <p className='text-[20px] font-medium'>{newDeliveryAddress?.subLocation}</p>
                        <p className='font-medium'>{newDeliveryAddress?.city || newDeliveryAddress?.district || newDeliveryAddress?.town}</p>
                    </div>
                </div>
                <button onClick={() => { setOpenMap(true), setEditDefaultAddress(true) }} className='px-4 py-1.5 bg-gray-300 rounded font-medium cursor-pointer'>Change</button>
            </div>
            <div className='flex flex-col gap-5'>
                <p className='text-[22px] font-medium text-gray-700'>We're missing your street / house number</p>
                <div className="relative">
                    <input
                        type="text"
                        name='street'
                        placeholder=' '
                        value={newDeliveryAddress?.road || newDeliveryAddress?.street}
                        onChange={handleOnChange}
                        className="peer markdown-input"
                    />
                    <label className="markdown-label">Street</label>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        name='apartment'
                        placeholder=' '
                        onChange={handleOnChange}
                        className="peer markdown-input"
                    />
                    <label className="markdown-label">Apartment</label>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        name='riderNote'
                        placeholder=' '
                        onChange={handleOnChange}
                        className="peer markdown-input w-[90%] h-22 overflow-y-auto"
                    />
                    <label className="markdown-label">Node to rider - e.g. building, landmark</label>
                </div>
                <div className='py-4'>
                    <p className='text-[20px] font-medium text-gray-700 pb-4'>Add a label</p>
                    <div className='flex items-center gap-3'>
                        <button onClick={() => setSelectedLabel('home')} className={`flex items-center gap-2  py-1 px-4 border border-gray-200 cursor-pointer rounded-2xl hover:scale-105 transition-transform ${selectedLabel == 'home' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-50'}`}><TiHomeOutline /> Home</button>
                        <button onClick={() => setSelectedLabel('work')} className={`flex items-center gap-2  py-1 px-4 border border-gray-200 cursor-pointer rounded-2xl hover:scale-105 transition-transform ${selectedLabel == 'work' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-50'}`}><MdOutlineWorkOutline /> Work</button>
                        <button onClick={() => setSelectedLabel('partner')} className={`flex items-center gap-2  py-1 px-4 border border-gray-200 cursor-pointer rounded-2xl hover:scale-105 transition-transform ${selectedLabel == 'partner' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-50'}`}><FaRegHeart /> Partner</button>
                        <button onClick={() => setSelectedLabel('other')} className={`flex items-center gap-2  py-1 px-4 border border-gray-200 cursor-pointer rounded-2xl hover:scale-105 transition-transform ${selectedLabel == 'other' ? 'bg-black text-white hover:bg-black' : 'hover:bg-gray-50'}`}><IoMdAdd /> Other</button>
                    </div>
                </div>
            </div>
            {
                editDefaultDeliveryAddress && !isAddNewDeliveryAddress ?
                    <button onClick={() => { updateDefaultDelieryAddress(), setShowLatestDeliveryAddress(true) }} className='w-full py-2.5 font-semibold text-[18px] cursor-pointer bg-orange-600 text-white rounded-2xl'>Update Address</button>
                    :
                    <button onClick={() => { dispatch(setNewDeliveryAddress('')), setShowLatestDeliveryAddress(true), addNewDeliveryAddress() }} className='w-full py-2.5 font-semibold text-[18px] cursor-pointer bg-orange-600 text-white rounded-2xl'>Save and Continue</button>
            }
        </div>
    )
}

export default UpdateDefaultDeliveryAddress