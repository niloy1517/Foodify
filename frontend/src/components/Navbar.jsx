




import React, { useContext, useState } from 'react'


import { SiIfood } from "react-icons/si";
import { GiShoppingCart } from "react-icons/gi";
import { FaAngleDown } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash, FaRegUser, FaChevronDown, FaBasketShopping } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";

import { CiViewList } from "react-icons/ci";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { GrFavorite } from "react-icons/gr";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { CiLocationOn } from "react-icons/ci";
import { storeContext } from '../Context/Context';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import CartPopup from '../AllPopupPages/CartPopup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { setUserData } from '../Service/Redux/Slice/UserDataSlice';
import { toast } from 'react-toastify';
import { logoutUser } from '../Service/Redux/Slice/AddToCartItemSlice';
import FindFoodByLocationPopup from '../AllPopupPages/FindFoodByLocationPopup';
import Authentication from '../Authentication/Authentication';


const Navbar = () => {
    const { showAuthenticationPopup, setShowAuthenticationPopup, loginPopup, setLoginPopup, userProfileData, profileDropdown, setProfileDropdown, findFoodByLocationPopup,
        setFindFoodByLocationPopup } = useContext(storeContext)

    const [cartPopup, setCartPopup] = useState(false)


    const userData = useSelector((state) => state.user.userData)

    const dispatch = useDispatch()
    const navigate = useNavigate()


    //USER LOGOUT FUNCTION
    const handleLogout = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/user/logout`, {}, { withCredentials: true })
            console.log(response)
            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUserData(''))
                navigate('/')
                setProfileDropdown(false)
                dispatch(logoutUser())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error("Something went wrong")
        }
    }


    return (
        <div className='top-0 left-0 sticky z-20 bg-white'>

            {/* NAVBAR FOR SMALL DEVICES */}
            <div className='py-2 lg:hidden shadow'>
                <div className='flex justify-between items-center px-6 py-2'>
                    <FaRegUser
                        onClick={() => {setShowAuthenticationPopup(true), setLoginPopup(true)}}
                        className='text-2xl cursor-pointer'
                    />
                    <div className='flex items-center gap-1.5 text-2xl font-bold text-orange-600'>
                        <SiIfood />
                        <p>Foodify.</p>
                    </div>

                    <div className='relative w-10 h-10 rounded-full bg-gray-50 flex justify-center items-center text-gray-500'>
                        <FaBasketShopping className='text-2xl' />
                        <p className='absolute top-0 right-[-10px] size-5 flex items-center justify-center text-white text-[13px] rounded-full bg-orange-600'>10</p>
                    </div>

                </div>

                {/* <div
                    onClick={() => setFindFoodByLocationPopup(true)}
                    className='flex items-center gap-2 justify-center pt-4 text-[15px] font-medium text-gray-600'>
                    <GrLocation className='text-2xl font-medium' />
                    <p>Road 71, Habiganj sadar, Habiganj</p>
                </div> */}
            </div>

            {/* NAVBAR FOR MD TO LG DEVICES */}    
            <div className='hidden lg:flex items-center justify-between px-20 py-8 shadow'>
                <div className='flex items-center gap-1.5 text-4xl font-bold text-orange-600'>
                    <SiIfood />
                    <p>Foodify.</p>
                </div>
                {/* <div
                    onClick={() => setFindFoodByLocationPopup(true)}
                    className='flex items-center gap-2 justify-center text-[17px] font-medium text-gray-600 px-3 py-1 rounded cursor-pointer hover:bg-gray-50'>
                    <GrLocation className='text-2xl font-medium' />
                    <p>Road 71, Habiganj sadar, Habiganj</p>
                </div> */}
                <div className='flex items-center gap-10'>
                    <div className='flex items-center gap-10'>
                        <button className='border border-gray-200 rounded px-2 py-1 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 hover:scale-105'>Sign In</button>
                        <button className='bg-orange-600 text-white px-4 py-1 rounded font-semibold cursor-pointer hover:scale-105'>Sign up for free delivery</button>
                    </div>
                    <div className='relative w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center text-gray-500 cursor-pointer'>
                        <FaBasketShopping className='text-2xl' />
                        <p className='absolute top-0 right-[-10px] size-5 flex items-center justify-center text-white text-[13px] rounded-full bg-orange-600'>10</p>
                    </div>
                </div>
            </div>


            <div>
                {
                    showAuthenticationPopup ? 
                    <Authentication />
                    :
                    <></>
                }
            </div>
        </div>
    )
}

export default Navbar






































// import React, { useContext, useState } from 'react'

// import { SiIfood } from "react-icons/si";
// import { GiShoppingCart } from "react-icons/gi";
// import { FaAngleDown } from "react-icons/fa";
// import { FaRegEye, FaRegEyeSlash, FaRegUser, FaChevronDown } from "react-icons/fa6";
// import { CiViewList } from "react-icons/ci";
// import { RiLogoutBoxRLine } from "react-icons/ri";
// import { IoMdHelpCircleOutline } from "react-icons/io";
// import { IoNotificationsOutline } from "react-icons/io5";
// import { GrFavorite } from "react-icons/gr";
// import { MdOutlineMarkEmailRead } from "react-icons/md";
// import { FiPhone } from "react-icons/fi";
// import { AiOutlineHome } from "react-icons/ai";
// import { VscAccount } from "react-icons/vsc";

// import { storeContext } from '../Context/Context';
// import { assets } from '../assets/assets';
// import { useNavigate } from 'react-router-dom';
// import CartPopup from '../AllPopupPages/CartPopup';
// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect } from 'react';
// import axios from 'axios';
// import { setUserData } from '../Service/Redux/Slice/UserDataSlice';
// import { toast } from 'react-toastify';
// import { logoutUser } from '../Service/Redux/Slice/AddToCartItemSlice';


// const Navbar = () => {
//     const { showAuthenticationPopup, setShowAuthenticationPopup, loginPopup, setLoginPopup, userProfileData, profileDropdown, setProfileDropdown } = useContext(storeContext)

//     const [cartPopup, setCartPopup] = useState(false)


//     const userData = useSelector((state) => state.user.userData)

//     const dispatch = useDispatch()
//     const navigate = useNavigate()


//     //USER LOGOUT FUNCTION
//     const handleLogout = async () => {
//         try {
//             const response = await axios.post(`http://localhost:5000/api/user/logout`, {}, { withCredentials: true })
//             console.log(response)
//             if (response.data.success) {
//                 toast.success(response.data.message)
//                 dispatch(setUserData(''))
//                 navigate('/')
//                 setProfileDropdown(false)
//                 dispatch(logoutUser())
//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             toast.error("Something went wrong")
//         }
//     }


//     return (
//         <div className='top-0 left-0 sticky z-20'>
//             {/* NAVBAR TOP */}
//             <div className='bg-orange-600 py-3 hidden justify-end items-center text-white space-x-40 pr-20 md:space-x-20'>
//                 <div className='flex gap-6 text-white font-medium'>
//                     <button
//                         className='border border-white px-4 py-1.5 cursor-pointer'
//                     >SIGN UP FOR A BUSINESS ACCOUNT</button>
//                     <button
//                         className='border border-white px-4 py-1.5 cursor-pointer'
//                     >SIGN UP TO BE A RESTAURANT PARTNER</button>
//                 </div>
//                 <div>
//                     <button className='text-2xl cursor-pointer'>x</button>
//                 </div>
//             </div>

//             {/* NAVBAR BOTTOM */}
//             <div className='bg-white py-3.5 flex justify-between items-center px-20 shadow-2xl'>
//                 {/* LOGO */}
//                 <div className='flex items-center gap-1.5 text-4xl font-bold text-orange-600'>
//                     <SiIfood />
//                     <p>Foodify.</p>
//                 </div>

//                 {/* PROFILE */}
//                 {
//                     !userData ?
//                         <div className='flex gap-10 items-center'>
//                             <button onClick={() => { setLoginPopup(true), setShowAuthenticationPopup(true) }} className='bg-white w-20 h-8 border text-gray-700 rounded-[2px] font-medium hover:bg-orange-600 hover:text-white cursor-pointer'>SIGN IN</button>
//                             <GiShoppingCart className='w-10 h-10 bg-gray-200 rounded-full p-1 cursor-not-allowed' />
//                         </div>
//                         :
//                         <div>
//                             <div className='flex items-center space-x-4'>
//                                 <img className='w-10' src={assets.profile_pic} alt="" />
//                                 <div onClick={() => { setProfileDropdown(true) }} className='flex items-end px-4 py-2 cursor-pointer rounded-[8px] hover:bg-gray-100'>
//                                     <p className='text-[20px] font-medium'>{userData?.profile?.name}</p>
//                                     <FaAngleDown className='text-orange-600 text-2xl' />
//                                 </div>
//                                 <GiShoppingCart onClick={() => setCartPopup(true)} className='ml-15 w-10 h-10 bg-gray-200 rounded-full p-1 cursor-pointer' />
//                             </div>
//                         </div>
//                 }
//             </div>
//             {
//                 cartPopup ? <CartPopup setCartPopup={setCartPopup} /> : <></>
//             }
//             <div >
//                 {
//                     profileDropdown &&
//                     <div onClick={() => setProfileDropdown(false)} className='fixed inset-0'>
//                         <div onClick={(e) => e.stopPropagation()} className="mt-16 w-70 shadow-2xl flex flex-col justify-center py-4 rounded-2xl gap-4 absolute bg-white right-20 top-20">

//                             <button className="flex items-center space-x-6 h-10 hover:bg-orange-600/15 px-4 mx-2 rounded-[8px] cursor-pointer">
//                                 <AiOutlineHome className="text-2xl" />
//                                 <span>Home</span>
//                             </button>
//                             <button onClick={() => { navigate('/profile'), setProfileDropdown(false) }} className="flex items-center space-x-6 h-10 hover:bg-orange-600/15 px-4 mx-2 rounded-[8px] cursor-pointer">
//                                 <VscAccount className="text-2xl" />
//                                 <span>Profile</span>
//                             </button>
//                             <button className="flex items-center space-x-6 h-10 hover:bg-orange-600/15 px-4 mx-2 rounded-[8px] cursor-pointer">
//                                 <IoNotificationsOutline className="text-2xl" />
//                                 <span>Notification</span>
//                             </button>
//                             <button onClick={() => navigate('/order')} className="flex items-center space-x-6 h-10 hover:bg-orange-600/15 px-4 mx-2 rounded-[8px] cursor-pointer">
//                                 <CiViewList className="text-2xl" />
//                                 <span>Order</span>
//                             </button>
//                             <button className="flex items-center space-x-6 h-10 hover:bg-orange-600/15 px-4 mx-2 rounded-[8px] cursor-pointer">
//                                 <IoMdHelpCircleOutline className="text-2xl" />
//                                 <span>Help center</span>
//                             </button>
//                             <hr className="text-gray-200 mx-4" />
//                             <button
//                                 onClick={handleLogout}
//                                 className="flex items-center space-x-6 h-10 hover:bg-orange-600/15 px-4 mx-2 rounded-[8px] cursor-pointer"
//                             >
//                                 <RiLogoutBoxRLine className="text-2xl" />
//                                 <span>Logout</span>
//                             </button>
//                         </div>
//                     </div>
//                 }
//             </div>
//         </div>
//     )
// }

// export default Navbar