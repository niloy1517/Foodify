import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const UserDeliveryInfo = () => {


    const [personalDetailsPopup, setPersonalDetailsPopup] = useState(false)
 
    const userData = useSelector((state) => state.user.userData)

    const [personalInfo, setPersonalInfo] = useState({})




    const handleOnChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
    }


    const handleUpdateProfileData = async () => {
        try {
            const payload = {
                ...personalInfo,
                userId: userData._id
            }
            const response = await axios.put(`http://localhost:5000/api/user/profile/update`, payload, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                response('response', response)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    const getUserDeliveryInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/profile/data/${userData._id}`)
            setPersonalInfo(response.data.data.profile)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserDeliveryInfo()
    }, [])

    return (
        <div className='bg-white py-6 px-4 md:px-10 flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <p className='text-[20px] font-semibold'>Personal details</p>
                <button onClick={() => setPersonalDetailsPopup(!personalDetailsPopup)} className='text-[18px] font-medium px-4 py-1 hover:bg-gray-100 cursor-pointer rounded text-gray-700'>{personalDetailsPopup ? 'Cancel' : 'Edit'}</button>
            </div>
            {
                personalDetailsPopup ?
                    <div className='w-full flex flex-col gap-5'>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder=' '
                                name='email'
                                value={personalInfo.email}
                                onChange={handleOnChange}
                                disabled
                                className="peer markdown-input text-gray-700 cursor-not-allowed"
                            />
                            <label className="markdown-label">Email</label>
                        </div>
                        <div className='w-full flex gap-4'>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    name='name'
                                    placeholder=' '
                                    value={personalInfo.name}
                                    onChange={handleOnChange}
                                    className="peer markdown-input"
                                />
                                <label className="markdown-label">Full Name</label>
                            </div>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    name='phone'
                                    placeholder=' '
                                    value={personalInfo.phone}
                                    onChange={handleOnChange}
                                    className="peer markdown-input"
                                />
                                <label className="markdown-label">Phone</label>
                            </div>
                        </div>
                        <button onClick={() => { handleUpdateProfileData(), setPersonalDetailsPopup(false) }} className='w-full py-2 rounded cursor-pointer bg-orange-600 text-[20px] font-semibold text-white'>Save</button>
                    </div>
                    :
                    <div className='flex flex-col gap-3 font-medium text-gray-700'>
                        <p>{personalInfo.name}</p>
                        <p>{personalInfo.email}</p>
                        <p>{personalInfo.phone}</p>
                    </div>
            }
        </div>
    )
}

export default UserDeliveryInfo