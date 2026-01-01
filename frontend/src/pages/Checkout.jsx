import React, { useEffect, useState } from 'react'
import Location from './Location'
import { ToastContainer } from 'react-toastify'
import DefaultDeliveryAddress from './DefaultDeliveryAddress'
import UpdateDefaultDeliveryAddress from './UpdateDefaultDeliveryAddress'
import ViewSavedDeliveryAddress from './ViewSavedDeliveryAddress'
import LatestDeliveryAddress from './LatestDeliveryAddress'
import UserDeliveryInfo from './UserDeliveryInfo'
import DeliveryItems from './DeliveryItems'
import axios from 'axios'
import { useSelector } from 'react-redux'

const Checkout = () => {

    axios.defaults.withCredentials = true;

    const [openMap, setOpenMap] = useState(false)
    const [editDefaultDeliveryAddress, setEditDefaultDeliveryAddress] = useState(false)
    const [showSavedAddresses, setShowSavedAddresses] = useState(false)
    const [addNewDeliveryAddress, setAddNewDeliveryAddress] = useState(false)
    const [showLatestDeliveryAddress, setShowLatestDeliveryAddress] = useState(false)
    const [deliveryAddress, setDeliveryAddress] = useState({})
    const [latestDeliveryAddress, setLatestDeliveryAddress] = useState('')
    const [personalInfo, setPersonalInfo] = useState('')
    const [isAddAddress, setIsAddAddress] = useState(false)





    const userData = useSelector((state) => state.user.userData)
    const checkoutDetails = useSelector((state) => state.cart.checkoutDetails);
    const { restaurantData, items } = checkoutDetails;

    const subtotal = items?.reduce((subtotal, currentSubtotal) => subtotal + (currentSubtotal.price * currentSubtotal.quantity), 0);
    const deliveryFee = restaurantData ? restaurantData.deliveryFee : 0;
    const total = subtotal + deliveryFee

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

    const submitPayment = async () => {
        console.log('checkout', items)
        try {
            const paylaod = {
                user: userData._id,
                customerName: personalInfo.name,
                email: personalInfo.email,
                phone: personalInfo?.phone,

                restaurant: restaurantData?._id,
                restaurantName: restaurantData?.restaurantName,

                subtotal,
                deliveryFee,
                total,

                items,

                address: deliveryAddress,

            }
            console.log('payload', paylaod)
            const response = await axios.post('http://localhost:5000/api/payment/init', paylaod, { withCredentials: true })
            if (response.data?.paymentUrl) {
                window.location.href = response.data.paymentUrl
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='bg-[#F9FAFB] lg:flex gap-10'>
            <ToastContainer />

            {/* Map Overlay */}
            {openMap && (
                <div
                    onClick={() => {
                        setOpenMap(false);
                        setEditDefaultDeliveryAddress(false);
                    }}
                    className='w-full z-50 h-screen bg-[#626466]/50 fixed flex justify-center items-center'
                >
                    <Location
                        setOpenMap={setOpenMap}
                        setEditDefaultDeliveryAddress={setEditDefaultDeliveryAddress}
                    />
                </div>
            )}
            <div className='w-full flex flex-col gap-4 pt-10'>
                <div>
                    {!editDefaultDeliveryAddress && !showSavedAddresses &&
                        <DefaultDeliveryAddress
                            setOpenMap={setOpenMap}
                            setEditDefaultDeliveryAddress={setEditDefaultDeliveryAddress}
                            setShowSavedAddresses={setShowSavedAddresses}
                            setDeliveryAddress={setDeliveryAddress}
                            latestDeliveryAddress={latestDeliveryAddress}
                        />
                    }


                    {showSavedAddresses &&
                        <ViewSavedDeliveryAddress
                            setOpenMap={setOpenMap}
                            setEditDefaultDeliveryAddress={setEditDefaultDeliveryAddress}
                            setShowSavedAddresses={setShowSavedAddresses}
                            setAddNewDeliveryAddress={setAddNewDeliveryAddress}
                            setDeliveryAddress={setDeliveryAddress}
                            setIsAddAddress={setIsAddAddress}
                        />
                    }

                    {showLatestDeliveryAddress &&
                        <LatestDeliveryAddress
                            setLatestDeliveryAddress={setLatestDeliveryAddress}
                            latestDeliveryAddress={latestDeliveryAddress}
                            editDefaultDeliveryAddress={editDefaultDeliveryAddress}
                            setEditDefaultDeliveryAddress={setEditDefaultDeliveryAddress}
                            isAddAddress={isAddAddress}
                            setDeliveryAddress={setDeliveryAddress}
                        />
                    }


                    {editDefaultDeliveryAddress && !showLatestDeliveryAddress &&
                        <UpdateDefaultDeliveryAddress
                            editDefaultDeliveryAddress={editDefaultDeliveryAddress}
                            isAddNewDeliveryAddress={addNewDeliveryAddress}
                            setShowLatestDeliveryAddress={setShowLatestDeliveryAddress}
                            setLatestDeliveryAddress={setLatestDeliveryAddress}
                        />
                    }
                </div>

                <UserDeliveryInfo />
                
                <div className='w-full px-4 flex flex-col gap-2 bg-white py-2 lg:py-0 fixed bottom-0 left-0 lg:static border-t lg:border-0 border-gray-200'>
                    <p className='lg:hidden flex justify-between items-center font-semibold'>Total <span className='text-orange-600 font-bold'>Tk {total}</span></p>
                    <button onClick={submitPayment} className='w-full h-14 rounded lg:mb-20 bg-orange-600 text-white cursor-pointer font-semibold'>Procede to Payment</button>
                </div>
            </div>
            <div className='mb-30 lg:mb-0 lg:w-[80%]'>
                <DeliveryItems />
            </div>
        </div>
    )
}

export default Checkout;
