import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { FiPhone } from "react-icons/fi";
import { TfiEmail } from "react-icons/tfi";
import { FaRegUser } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import { RiSecurePaymentLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaRegHeart } from "react-icons/fa6";
import { MdCurrencyExchange } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { RiMessage2Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { LuLocateFixed } from "react-icons/lu";
import { storeContext } from '../Context/Context';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../Service/Redux/Slice/UserDataSlice';

const Profile = () => {
    const { locateLocation, coordinates, setCoordinates, address, setAddress, fetchSuggestions, handleLocationSubmit, suggestAddress, SERVER_URL, userProfileData } = useContext(storeContext)
    const { addressPart, short } = address;
    const [selectedBtn, setSelectedBtn] = useState('userProfilePopup')
    const [month, setMonth] = useState('');
    const [date, setDate] = useState('');
    const [year, setYear] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [changePasswordPopup, setChangePasswordPopup] = useState(true)
    const [verifyPopup, setVerfiyPopop] = useState(false)
    const [resendBtn, setResendBtn] = useState(false)
    const [timerStatus, setTimerStatus] = useState(false)
    const [otpValidityTime, setOtpValidityTime] = useState(0);
    const [passwordPage, setPasswordPage] = useState(false)
    const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false)
    const [isShowNewPassword, setIsShowNewPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [isShowLocationPopup, setIsShowLocationPopup] = useState(false)
    const [otp, setOtp] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [dateOfBirth, setDateOfBirth] = useState({
        month: '',
        date: '',
        year: ''
    })
    const [updateProfileData, setUpdateProfileData] = useState({
        name: '',
        email: '',
        username: '',
        phone: '',
        gender: '',
        dateOfBirth

    })

    const [userAddressData, setUserAddressData] = useState({
        label: "",
        house: "",
        road: "",
        block: "",
        city: "",
        district: "",
        postalCode: "",
        country: "",
        location: {
            type: "Point",
            coordinates: [0, 0]
        }
    });

    console.log('userAddressData', userAddressData)



    const userData = useSelector((state) => state.user.userData)

    const dispatch = useDispatch()

    axios.defaults.withCredentials = true;

    const { lat, lng } = coordinates;
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const years = [];
    const days = [];
    for (let y = 1900; y <= new Date().getFullYear(); y++) years.push(y);
    for (let d = 1; d <= 31; d++) days.push(d);

    const handleOnchange = (e) => {
        setUpdateProfileData({ ...updateProfileData, [e.target.name]: e.target.value })
        setUserAddressData({ ...userAddressData, [e.target.name]: e.target.value })
    }

    const getUserProfileData = async () => {
        try {
            const response = await axios(`http://localhost:5000/api/user/profile/data/${userData._id}`)
            dispatch(setUserData(response.data.data))
            setUpdateProfileData(response.data.data.profile)
            setUserAddressData(response.data.data.address[0])


            if (userData.profile.dateOfBirth) {
                const userDateOfBirth = JSON.parse(userData.profile.dateOfBirth);
                setMonth(userDateOfBirth.month)
                setDate(userDateOfBirth.date)
                setYear(userDateOfBirth.year)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserProfileData()
    }, [])

    // Marker icon fix
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });


    const MapEventHandeler = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setCoordinates({ lat, lng })
                setUserAddressData(prev => ({
                    ...prev,
                    location: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    }
                }))
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await response.json()

console.log(data)
                    if (data) {
                        setUserAddressData(prev => ({
                            ...prev,
                            road: data.address.road || userAddressData.road,
                            city: data.address.city || data.address.town || userAddressData.city,
                            district: data.address.state_district || userAddressData.district,
                            postalCode: data.address.postcode || userAddressData.postalCode,
                            country: data.address.country || userAddressData.country,

                        }))
                        const addressPart = data.address
                        let part = [
                            addressPart.quarter,
                            addressPart.suburb,
                            addressPart.village,
                            addressPart.town,
                            addressPart.city,
                            addressPart.road,
                            addressPart.postcode
                        ].filter(Boolean)

                        if (addressPart.quarter || addressPart.suburb || addressPart.city || addressPart.town || addressPart.village || addressPart.road || addressPart.postcode) {
                            const short = part.slice(1, 5, + addressPart.postcode).join(', ')
                            setUserAddressData(prev => ({
                                ...prev,
                                subLocation: short
                            }))
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }
    // Custom Dropdown Component (Daraz Style)
    const CustomDropdown = ({ label, options, value, setValue, id }) => {
        return (
            <div className="relative w-full">
                <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
                    className="w-full h-12 px-3 text-left border border-gray-300 bg-white flex justify-between items-center rounded-[4px] hover:border-orange-500 transition-all"
                >
                    <span>{value || label}</span>
                    <TiArrowUnsorted className="text-gray-600" />
                </button>

                {openDropdown === id && (
                    <div className="absolute bg-white w-full mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {options.map((opt, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setValue(opt);
                                    setOpenDropdown(null);
                                }}
                                className={`px-3 py-2 cursor-pointer hover:bg-orange-100 ${value === opt ? 'bg-orange-50 text-orange-600 font-medium' : ''
                                    }`}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };


    //BACKEND CODE START HERE

    //UPDATE USER PERSONAL FROFILE INFO 
    const handleUpdateProfileData = async () => {

        const updateDob = { ...dateOfBirth, month, date, year }
        const dob = JSON.stringify(updateDob)
        const newUpdateProfileData = { ...updateProfileData, dateOfBirth: dob }

        try {
            const response = await axios.put(`${SERVER_URL}/api/user/profile/update`, newUpdateProfileData, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }


    const userAddressAdd = async () => {
        try {
            const payload = {
                ...userAddressData,
                userId: userData._id,
                location: {
                    type: "Point",
                    coordinates: [coordinates.lng, coordinates.lat]

                },
                subLocation: userAddressData?.subLocation,
            }

            console.log('payload', payload)
            const response = await axios.post(`${SERVER_URL}/api/user/address/add`, payload, { withCredentials: true })

            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    //CHANGE USER PASSWORD
    const handleSendChangePasswordOtp = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/user/change/password/otp`, { email: userData.profile.email }, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    const handleVerifyChangePasswordOtp = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/user/change/password/otp/verify`, { otp }, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                setPasswordPage(true)
                setVerfiyPopop(false)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    const handleChangePassword = async () => {

        console.log('oppos', currentPassword, newPassword, confirmPassword)
        try {
            const response = await axios.post(`${SERVER_URL}/api/user/change/password`, { currentPassword, newPassword, confirmPassword }, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }
    return (
        <div className='bg-[#F8F8FA] w-full h-[100vh] flex gap-12 my-10 px-14'>
            <ToastContainer />
            <div className='w-80 h-[50%] bg-white text-gray-800'>
                <div className='flex justify-center mt-8'>
                    <img className='w-34 h-34 rounded-full' src={assets.profile_pic} alt="" />
                </div>
                <p className='text-center font-medium text-2xl mt-2 '>{userData.profile.name}</p>
                <div className='flex flex-col gap-3 text-[20px] px-4 mt-12'>
                    <p className='flex gap-2 items-center'><TiShoppingCart /> Orders Placed: 12</p>
                    <p className='flex gap-2 items-center'><FaRegHeart /> Wishlist Items: 5</p>
                    <p className='flex gap-2 items-center'><RiMessage2Line /> Reviews Given: 3</p>
                    <p className='flex gap-2 items-center'><MdCurrencyExchange /> Total Spent: $340</p>
                </div>
                <button className='bg-orange-600 text-white flex mx-auto mt-6 px-18 rounded-[6px] text-[20px] py-1.5 cursor-pointer font-medium'>Subscribe</button>
            </div>
            <div className='w-190 text-[18px]'>
                <div className='px-6 pt-6 flex justify-center items-center border-b bg-white border-gray-200'>
                    <button onClick={() => setSelectedBtn('userProfilePopup')} className={`h-12 px-6 hover:border border-gray-200 font-medium text-[18px] cursor-pointer ${selectedBtn === 'userProfilePopup' ? 'border border-gray-200 border-b-0 bg-orange-500 text-white' : ''}`}>User Profile</button>
                    <button onClick={() => setSelectedBtn('updateProfilePopup')} className={`h-12 px-6 hover:border border-gray-200 font-medium text-[18px] cursor-pointer ${selectedBtn === 'updateProfilePopup' ? 'border border-gray-200 border-b-0 bg-orange-500 text-white' : ''}`}>Update Profile</button>
                    <button onClick={() => setSelectedBtn('updateAddressPopup')} className={`h-12 px-6 hover:border border-gray-200 font-medium text-[18px] cursor-pointer ${selectedBtn === 'updateAddressPopup' ? 'border border-gray-200 border-b-0 bg-orange-500 text-white' : ''}`}>Upadate Location</button>
                    <button onClick={() => setSelectedBtn('changePasswordPopup')} className={`h-12 px-6 hover:border border-gray-200 font-medium text-[18px] cursor-pointer ${selectedBtn === 'changePasswordPopup' ? 'border border-gray-200 border-b-0 bg-orange-500 text-white' : ''}`}>Change Password</button>
                </div>
                {selectedBtn === 'userProfilePopup' &&
                    <div className='w-full h-auto px-4 pb-4 bg-white p-6 text-gray-800'>
                        <div className='flex justify-between items-center p-4 border border-gray-200 rounded-[4px]'>
                            <div className='flex flex-col gap-4'>
                                <div className='flex space-x-1.5'>
                                    <p className='font-medium flex items-center gap-1'><FaRegUser />Name:</p>
                                    <span>{updateProfileData?.name}</span>
                                </div>
                                <div className='flex space-x-1.5'>
                                    <p className='font-medium flex items-center gap-1'><FiPhone />Username:</p>
                                    <span>{updateProfileData?.username}</span>
                                </div>
                            </div>
                            <div className='flex flex-col gap-4'>
                                <div className='flex space-x-1.5'>
                                    <p className='font-medium flex items-center gap-1'><TfiEmail />Email:</p>
                                    <span>{updateProfileData.email}</span>
                                </div>
                                <div className='flex space-x-1.5'>
                                    <p className='font-medium flex items-center gap-1'><FiPhone />Phone:</p>
                                    <span>{updateProfileData.phone ? updateProfileData?.phone : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <div className='m-6'>
                            <p className='font-medium text-[20px]'>Saved Address</p>
                            <p className='border border-gray-200 px-4 py-3 mt-2 rounded-[4px]'>{userAddressData?.subLocation == '' ? "You haven’t added any address yet!" : `${userAddressData?.subLocation}`}</p>
                        </div>
                    </div>
                }
                {selectedBtn === 'updateProfilePopup' &&
                    <div className='px-10 py-4 bg-white text-gray-800'>
                        <div className='flex justify-between text-[18px]'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col'>
                                    <label htmlFor="name" className='font-medium'>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={updateProfileData?.name}
                                        onChange={handleOnchange}
                                        className='w-75 h-12 px-3 outline-0 border border-gray-200 hover:border-orange-600 rounded-[4px]'
                                    />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="email" className='font-medium'>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={updateProfileData?.email}
                                        className='w-75 h-12 px-3 outline-0 border border-gray-200 rounded-[4px]'
                                    />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="username" className='font-medium'>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={updateProfileData.username}
                                        onChange={handleOnchange}
                                        className='w-75 h-12 px-3 outline-0 border border-gray-200 hover:border-orange-600 rounded-[4px]'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col'>
                                    <label htmlFor="phone" className='font-medium'>Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        value={updateProfileData.phone}
                                        onChange={handleOnchange}
                                        className='w-75 h-12 px-3 outline-0 border border-gray-200 hover:border-orange-600 rounded-[4px]'
                                    />
                                </div>

                                <label className='font-medium'>Date Of Birth</label>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <CustomDropdown label="Month" options={months} value={month} setValue={setMonth} id="month" />
                                    </div>
                                    <div className="flex-1">
                                        <CustomDropdown label="Day" options={days.map(d => d < 10 ? `0${d}` : `${d}`)} value={date} setValue={setDate} id="day" />
                                    </div>
                                    <div className="flex-1">
                                        <CustomDropdown label="Year" options={[...years].reverse()} value={year} setValue={setYear} id="year" />
                                    </div>
                                </div>

                                <label htmlFor="gender" className='font-medium mt-[-6px] mb-[-8px]'>Gender</label>
                                <select name="gender" id="gender" value={updateProfileData.gender} onChange={handleOnchange} className='w-75 h-12 px-3 outline-0 border border-gray-200 hover:border-orange-600 rounded-[4px]'>
                                    <option value="" className='hidden'>Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex justify-end mt-6'>
                            <button onClick={handleUpdateProfileData} className='organge px-6 py-2 bg-orange-600 text-white cursor-pointer rounded-[4px]'>Save Changes</button>
                        </div>
                    </div>
                }
                {selectedBtn === 'updateAddressPopup' &&
                    <div className='w-full flex flex-col gap-8 bg-white py-6 px-6'>
                        <div className='w-full flex justify-between gap-6'>
                            <div className='flex-1 flex flex-col gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <div className="relative flex-1">
                                        <select name="label" id="label" value={userAddressData?.label} onChange={handleOnchange} className="peer markdown-input">
                                            <option value="" className='hidden'>Select...</option>
                                            <option value="home">Home</option>
                                            <option value="office">Office</option>
                                            <option value="work">Work</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <label className="markdown-label">Label</label>
                                    </div>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        name='road'
                                        value={userAddressData?.road}
                                        placeholder=' '
                                        onChange={handleOnchange}
                                        className="peer markdown-input"
                                    />
                                    <label className="markdown-label">Road</label>
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col gap-6'>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        name='house'
                                        value={userAddressData?.house}
                                        placeholder=' '
                                        onChange={handleOnchange}
                                        className="peer markdown-input"
                                    />
                                    <label className="markdown-label">House</label>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        name='block'
                                        value={userAddressData?.block}
                                        placeholder=' '
                                        onChange={handleOnchange}
                                        className="peer markdown-input"
                                    />
                                    <label className="markdown-label">Block</label>
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex justify-between gap-6'>
                            <div className='flex-1 flex flex-col gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            name='city'
                                            value={userAddressData?.city}
                                            placeholder=' '
                                            onChange={handleOnchange}
                                            className="peer markdown-input"
                                        />
                                        <label className="markdown-label">City</label>
                                    </div>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        name='district'
                                        value={userAddressData?.district}
                                        placeholder=' '
                                        onChange={handleOnchange}
                                        className="peer markdown-input"
                                    />
                                    <label className="markdown-label">District</label>
                                </div>
                            </div>
                            <div className='flex-1 flex flex-col gap-6'>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        name='postalCode'
                                        value={userAddressData?.postalCode}
                                        placeholder=' '
                                        onChange={handleOnchange}
                                        className="peer markdown-input"
                                    />
                                    <label className="markdown-label">Postal code</label>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        name='country'
                                        value={userAddressData?.country}
                                        placeholder=' '
                                        onChange={handleOnchange}
                                        className="peer markdown-input"
                                    />
                                    <label className="markdown-label">Country</label>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-6'>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    name='subLocation'
                                    placeholder=' '
                                    value={userAddressData?.subLocation}
                                    onChange={handleOnchange}
                                    className="peer markdown-input"
                                />
                                <label className="markdown-label">Location</label>
                            </div>
                            <button onClick={() => setIsShowLocationPopup(true)} className='px-8 py-2 rounded bg-gray-100 font-medium text-gray-700 cursor-pointer'>Edit</button>
                        </div>
                        <div className='flex justify-end'>
                            <button onClick={userAddressAdd} className='organge px-6 py-2 bg-orange-600 text-white cursor-pointer rounded-[4px]'>Save Changes</button>
                        </div>
                    </div>
                }
                {isShowLocationPopup &&
                    <div className='bg-white h-160 overflow-hidden top-34 absolute px-4'>
                        <div className='w-full h-16 flex items-center gap-6 border border-gray-200 px-4 my-6'>
                            <input
                                type="text"
                                placeholder='Enter your loaction'
                                value={address.short}
                                onChange={(e) => { setAddress(e.target.value) }}
                                className='w-[75%] outline-0' />
                            <button onClick={() => { locateLocation() }} className='flex items-center gap-2 hover:text-orange-600 cursor-pointer'><LuLocateFixed /> Locate Me</button>
                        </div>
                        {
                            <MapContainer center={[lat, lng]} zoom={13} className="w-160 h-96 relative z-0">
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[lat, lng]} />
                                <MapEventHandeler />
                            </MapContainer>

                        }

                        <button onClick={() => {
                            setIsShowLocationPopup(false), setUserAddressData({
                                road: addressPart?.road || userAddressData?.road,
                                city: addressPart.city || data.address.town || userAddressData.city,
                                district: addressPart.state_district || userAddressData.district,
                                postalCode: addressPart.postcode || userAddressData.postalCode,
                                country: addressPart.country || userAddressData.country,
                                subLocation: short || userAddressData?.subLocation
                            })
                        }} className='w-full h-14 bg-orange-600 text-white font-bold mt-10 cursor-pointer'>Submit Location</button>
                    </div>
                }
                {selectedBtn === 'changePasswordPopup' &&
                    <div className='px-10 py-6 bg-white text-gray-800'>
                        {changePasswordPopup &&
                            <div>
                                <h1 className='text-2xl font-medium'>Security Verification</h1>
                                <div className='flex justify-center items-center mx-auto my-3 w-26 h-26 rounded-full bg-orange-600 text-white'>
                                    <RiSecurePaymentLine className='w-22 h-22' />
                                </div>
                                <p className='text-center text-[15px] px-15'>To protect your account security, we need to verify your identity Please choose a way to verify:</p>
                                <div className='flex flex-col gap-3 items-center mt-8'>
                                    <button onClick={() => { setChangePasswordPopup(false), setVerfiyPopop(true) }} className='flex justify-center items-center gap-2 w-70 h-12 border border-gray-200 hover:border-orange-600 cursor-pointer'><TfiEmail />Verify through Email</button>
                                    <button className='flex justify-center items-center gap-2 w-70 h-12 border border-gray-200 hover:border-orange-600 cursor-pointer'><FcGoogle />Verify through Google</button>
                                </div>
                            </div>
                        }
                        {verifyPopup &&
                            <div>
                                <h1>We will send a one time code to your Email</h1>
                                <div className='flex flex-col gap-4 mt-6'>
                                    <input className='w-90 h-10 border border-gray-200 px-4 outline-0' type="text" value={userData.profile.email} />
                                    <div className='w-90 h-10 text-[15px] border border-gray-200 flex items-center justify-between px-4'>
                                        <input
                                            type="text"
                                            placeholder='Please enter verification code'
                                            onChange={(e) => setOtp(e.target.value)}
                                            className='outline-0 w-[70%]'
                                        />
                                        <button onClick={() => {
                                            if (otpValidityTime > 0) return
                                            setResendBtn(true),
                                                setTimerStatus(true),
                                                setOtpValidityTime(60),
                                                handleSendChangePasswordOtp()
                                        }
                                        } className={`cursor-pointer hover:text-cyan-600 ${resendBtn && 'text-cyan-600'}`}>{resendBtn ? `Resend${otpValidityTime === 0 ? '' : ` (${otpValidityTime})`}` : 'Send'}</button>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <button onClick={() => { handleVerifyChangePasswordOtp() }} className='w-80 h-10 mt-6 bg-orange-600 text-white font-medium rounded-[6px] cursor-pointer'>Verify Code</button>
                                        <button onClick={() => { setChangePasswordPopup(true), setVerfiyPopop(false) }} className='w-80 h-10 border border-gray-200 hover:border-orange-600 cursor-pointer'>Use other way to verify</button>
                                    </div>
                                </div>
                            </div>
                        }
                        {passwordPage &&
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="">Current password</label>
                                    <div className='w-110 h-10 flex px-3 items-center border border-gray-200 hover:border-orange-600 rounded-[6px]'>
                                        <input
                                            type={isShowCurrentPassword ? "text" : "password"}
                                            onChange={(e) => { setCurrentPassword(e.target.value) }}
                                            className='w-full outline-0' />
                                        {isShowCurrentPassword ? <FaRegEye onClick={() => setIsShowCurrentPassword(!isShowCurrentPassword)} /> : <FaRegEyeSlash onClick={() => setIsShowCurrentPassword(!isShowCurrentPassword)} />}
                                    </div>
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="">New password</label>
                                    <div className='w-110 h-10 flex px-3 items-center border border-gray-200 hover:border-orange-600 rounded-[6px]'>
                                        <input
                                            type={isShowNewPassword ? "text" : "password"}
                                            onChange={(e) => { setNewPassword(e.target.value) }}
                                            className='w-full outline-0' />
                                        {isShowNewPassword ? <FaRegEye onClick={() => setIsShowNewPassword(!isShowNewPassword)} /> : <FaRegEyeSlash onClick={() => setIsShowNewPassword(!isShowNewPassword)} />}
                                    </div>
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="">Confirm password</label>
                                    <div className='w-110 h-10 flex px-3 items-center border border-gray-200 hover:border-orange-600 rounded-[6px]'>
                                        <input
                                            type={isShowConfirmPassword ? "text" : "password"}
                                            onChange={(e) => { setConfirmPassword(e.target.value) }}
                                            className='w-full outline-0' />
                                        {isShowConfirmPassword ? <FaRegEye onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)} /> : <FaRegEyeSlash onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)} />}
                                    </div>
                                </div>
                                <div className='flex gap-4 justify-center mt-6'>
                                    <button onClick={() => { setSelectedBtn('userProfilePopup') }} className='px-6 py-0.5 border border-gray-200 hover:bg-blue-100 cursor-pointer'>Cancle</button>
                                    <button onClick={handleChangePassword} className='px-6 py-0.5 bg-orange-600 text-white cursor-pointer'>Save</button>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Profile