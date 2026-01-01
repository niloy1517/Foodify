import React from 'react'
import { useSelector } from 'react-redux'


const DeliveryItems = () => {
    const checkoutDetails = useSelector((state) => state.cart.checkoutDetails);
    const { restaurantData, items } = checkoutDetails;

    const subtotal = items?.reduce((subtotal, currentSubtotal) => subtotal + (currentSubtotal.price * currentSubtotal.quantity), 0);
    const deliveryFee = restaurantData ? restaurantData.deliveryFee : 0;
    const total = subtotal + deliveryFee

    return (
        <div className='w-full text-gray-700 mt-4 lg:mt-30'>
            <div className='w-full lg:w-[400px] h-auto py-2 lg:py-6 lg:shadow px-4 lg:px-6 bg-white'>
                <p className='text-2xl xl:text-[30px] font-bold text-gray-800 pb-2 xl:pb-4'>Your order from</p>
                <div className='flex items-center space-x-3 xl:text-2xl font-medium'>
                    <img className='hidden xl:block w-25 h-20 rounded-2xl' src={`http://localhost:5000/images/${restaurantData?.image}`} alt="" />
                    <>{restaurantData?.restaurantName}</>
                </div>
                <div className='flex flex-col gap-3 border-b border-gray-200 pb-3 text-[18px] pt-8'>
                    {
                        items.map(item => (
                            <div className='flex justify-between'>
                                <div className='flex space-x-2'>
                                    <p>{item.quantity} x</p>
                                    <p>{item.foodName}</p>
                                </div>
                                <p className=''>Tk {item.quantity * item.price}</p>
                            </div>
                        ))
                    }
                </div>
                <div className='flex flex-col gap-2 lg:text-[18px] font-medium'>
                    <p className='flex justify-between items-center'>Subtotal <span>Tk {subtotal}</span></p>
                    <p className='flex justify-between items-center'>Delivery Fee <span>Tk {deliveryFee}</span></p>
                    <p className='hidden lg:flex justify-between items-center text-3xl font-extrabold pt-4'>Total <span className='text-orange-600'>Tk {total}</span></p>
                </div>
            </div>
        </div>
    )
}

export default DeliveryItems