import React, { useContext, useRef, useState } from 'react'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { storeContext } from '../Context/Context';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../Service/Redux/Slice/UserDataSlice';
import { logoutUser } from '../Service/Redux/Slice/AddToCartItemSlice';
const Authentication = () => {
    const { showAuthenticationPopup, setShowAuthenticationPopup, SERVER_URL, loginPopup, setLoginPopup, isLoginPage, setIsLoginPage, userProfileData, setUserProfileData, getUerProfileData } = useContext(storeContext)

    const userData = useSelector((state) => state.user.userData);
console.log('Navbar1', userData)    
    const userId = userData?._id || "guest";
console.log('Navbar', userId)

    const inputRefs = useRef([])

    
    const [showPassword, setShowPassword] = useState(false)
    const [resetPasswordPopup, setResetPasswordPopup] = useState(false)
    const [resetPasswordOtpPopup, setResetPasswordOtpPopup] = useState(false)
    const [email, setEmail] = useState()
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const dispatch = useDispatch()






    const handleOnchange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    }

    // USER REGISTRATION FUNCTION
    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${SERVER_URL}/api/user/registration`, registerData, { withCredentials: true })

            if (response.data.success) {
                toast.success(response.data.message)
                setRegisterData({ name: '', email: '', password: '' })
                setIsLoginPage(true)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    // USER LOGIN FUNCTION
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${SERVER_URL}/api/user/login`, registerData, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message)
                setShowAuthenticationPopup(false)
                dispatch(setUserData(response.data.data))
                console.log('login', userId)
                dispatch(logoutUser(userId))
            } else {
                toast.error(response.data.message)
            }
            setRegisterData({ email: '', password: '' })
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }






    const handleRestPassword = () => {
        console.log('rest password')
        setLoginPopup(false)
        setResetPasswordPopup(true)
    }


    const handleInput = (e, index) => {
        if (e.target.value.length && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus()
        }

        const currentOtp = inputRefs.current.map(input => input.value || '').join('')
        setOtp(currentOtp)
    }

    const handleOnKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus()
        }

        const currentOtp = inputRefs.current.map(input => input.value || '').join('')
        setOtp(currentOtp)
    }

    const handleCopyPaste = (e) => {
        const pasteData = e.clipboardData.getData('text').split('')
        pasteData.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });

        const lastIndex = Math.min(pasteData.length, inputRefs.current.length) - 1;
        if (lastIndex >= 0) {
            inputRefs.current[lastIndex].focus();
        }

        const currentOtp = inputRefs.current.map(input => input.value || '').join('')
        setOtp(currentOtp)
    }


    const handleSendRestPasswordOtp = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/user/reset/password/otp`, { email })

            if (response.data.success) {
                toast.success(response.data.message)

                setTimeout(() => {
                    setResetPasswordPopup(false)
                    setResetPasswordOtpPopup(true)
                }, 4000)

            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Something is wrong try again!')
        }
    }

    const handleResetPassword = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/user/reset/password`, { email, otp, newPassword })

            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.success('Something is wrong please try again!')
        }
    }



    return (
        <div onClick={() => setShowAuthenticationPopup(false)} className='fixed inset-0 z-50 bg-black/20 flex justify-center items-center'>
            {
                loginPopup &&
                <form onSubmit={isLoginPage ? handleLogin : handleRegister} onClick={(e) => e.stopPropagation()} className='bg-white text-black w-80 md:w-100 h-100 flex flex-col px-6 py-6 rounded-[8px]'>
                    <h1 className='font-bold text-3xl text-gray-700 pb-2'>{isLoginPage ? "Log In" : "Register"}</h1>
                    <p className='text-[18px] font-sans mb-8'>{isLoginPage ? "Login to your account" : "Registration only takes a minute"}</p>
                    <div className='w-[280px] md:w-full flex flex-col gap-4'>
                        {!isLoginPage &&
                            <input
                                className='border outline-0 py-1.5 px-2.5 border-gray-300'
                                type="text"
                                placeholder='Full Name'
                                name='name'
                                onChange={handleOnchange}
                                value={registerData.name}
                            />
                        }
                        <input
                            className='border outline-0 py-1.5 px-2.5 border-gray-300 rounded-[4px]'
                            type="email"
                            placeholder='Email'
                            name='email'
                            onChange={handleOnchange}
                            value={registerData.email}
                        />
                        <div className='flex items-center border py-1 px-2.5 border-gray-300 rounded-[4px]'>
                            <input
                                className='w-full outline-0'
                                type={showPassword ? "text" : "password"}
                                placeholder='Password'
                                name='password'
                                onChange={handleOnchange}
                                value={registerData.password}
                            />
                            {
                                showPassword ? <FaRegEye className='cursor-pointer' onClick={() => setShowPassword(false)} /> : <FaRegEyeSlash className='cursor-pointer' onClick={() => setShowPassword(true)} />
                            }
                        </div>
                        {
                            isLoginPage &&
                            <span onClick={handleRestPassword} className='cursor-pointer mr-0 m-auto text-gray-800 py-1.5 w-34'>Forget password?</span>
                        }
                    </div>
                    <input
                        className='bg-orange-600 text-white py-1.5 rounded-[4px] mt-8 cursor-pointer'
                        type="submit"
                        value={isLoginPage ? "Log in" : "Register"}
                    />

                    <div className='text-center pt-6'>
                        {
                            isLoginPage ?
                                <p>Don't have an account? <span className='font-medium cursor-pointer' onClick={() => setIsLoginPage(false)}>Register</span></p>
                                :
                                <p>Already have an account? <span className='font-medium cursor-pointer' onClick={() => setIsLoginPage(true)}>Log in</span></p>

                        }
                    </div>
                </form>
            }
            {
                resetPasswordPopup &&
                <div onClick={(e) => e.stopPropagation()} className='bg-white p-2 text-black w-100 h-auto flex flex-col px-6 py-6 rounded-[8px]'>
                    <h1 className='font-medium pb-4'>Forgot your password?</h1>
                    <p className='pb-4'>Please enter the account that you want to reset the password.</p>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name=''
                        id='email'
                        placeholder='Please enter your email'
                        className='border border-gray-300 rounded-[4px] p-2 outline-blue-200 mt-1'
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className='flex justify-end gap-6 mt-10'>
                        <button onClick={() => { setLoginPopup(true), setResetPasswordPopup(false) }} className='w-20 h-8 border border-orange-600 hover:bg-amber-50 rounded-[4px] cursor-pointer'>Back</button>
                        <button onClick={handleSendRestPasswordOtp} className='w-23 h-8 rounded-[4px] cursor-pointer bg-orange-600 text-white'>Confirm</button>
                    </div>
                </div>
            }
            {
                resetPasswordOtpPopup &&
                <div onClick={(e) => e.stopPropagation()} className='bg-white p-2 text-black w-100 h-auto flex flex-col px-6 py-6 rounded-[8px]'>

                    <p className='pb-4'>Please provide the OTP sent to your email and create a new password.</p>

                    <label htmlFor="">Enter 6-digit otp</label>
                    <div onPaste={handleCopyPaste} className='flex space-x-1.5 mt-1 mb-4'>
                        {
                            Array(6).fill(0).map((_, index) => (
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    key={index}
                                    maxLength={1}
                                    className='w-9 h-9 border border-gray-300 text-center'
                                    ref={(el) => inputRefs.current[index] = el}
                                    onInput={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleOnKeyDown(e, index)}
                                />
                            ))
                        }
                    </div>

                    <label htmlFor="password">New password</label>
                    <input
                        type="text"
                        name=""
                        id="password"
                        placeholder='Enter your password'
                        className='border px-2 py-1.5 mt-1 rounded-[4px]'
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button onClick={handleResetPassword} className='bg-orange-600 text-white w-34 h-9 mr-0 mt-6 m-auto cursor-pointer rounded-[6px]'>Rest password</button>
                </div>
            }
        </div>
    )
}

export default Authentication

