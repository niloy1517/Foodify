import React, { useContext } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { TiHomeOutline } from "react-icons/ti";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineReceiptLong } from "react-icons/md";
import { BiHelpCircle } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { storeContext } from '../../Context/Context';
import { logoutUser } from '../../Service/Redux/Slice/AddToCartItemSlice';
import { setUserData } from '../../Service/Redux/Slice/UserDataSlice';
import { axiosInstance } from '../../Api/axiosInstance';

const ProfileModal = () => {
    const { setIsDropdownMenu } = useContext(storeContext)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    //USER LOGOUT FUNCTION
    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post(`/user/logout`, {})
            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUserData(''))
                navigate('/')
                setIsDropdownMenu(false)
                dispatch(logoutUser())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error("Something went wrong")
        }
    }
    return (
        <div className='w-full h-screen flex flex-col text-gray-700 '>
            <div onClick={() => setIsDropdownMenu(false)} className='absolute top-4 right-4 w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-gray-100'>
                <IoCloseOutline className='text-3xl ' />
            </div>
            <div className='px-4 text-[18px] mt-20'>
                <div className='pb-2'>
                    <button className='w-full flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-100 rounded font-semibold'><TiHomeOutline className='text-2xl' /> <span>Home</span></button>
                    <button className='w-full flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-100 rounded font-semibold'><RiAccountPinBoxLine className='text-2xl' /> <span>Profile</span></button>
                    <button className='w-full flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-100 rounded font-semibold'><IoNotificationsOutline className='text-2xl' /> <span>Notification</span></button>
                    <button className='w-full flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-100 rounded font-semibold'><MdOutlineReceiptLong className='text-2xl' /> <span>Order</span></button>
                </div>
                <div className='border-t border-gray-200 pt-2'>
                    <button className='w-full flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-100 rounded font-semibold'><BiHelpCircle className='text-2xl' /> <span>Help center</span></button>
                    <button onClick={handleLogout} className='w-full flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-100 rounded font-semibold'><MdLogout className='text-2xl' /> <span>Logout</span></button>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal