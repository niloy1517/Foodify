import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GrAdd } from "react-icons/gr";
import { addToCart, setUser } from '../Service/Redux/Slice/AddToCartItemSlice';
import { axiosInstance } from '../Api/axiosInstance';

const RestaurantFoodList = () => {
    const restaurantId = useSelector((state) => state.restaurant.restaurantId)
    const restaurantData = useSelector((state) => state.restaurant.restaurantData)

    const userData = useSelector((state) => state.user.userData)

    const userId = userData?._id || "guest";

    const dispatch = useDispatch()

    const [categories, setCategories] = useState([])
    const [foods, setFoods] = useState([])
    const [orderData, setOrderData] = useState({})


    const getRestaurantFoodList = async () => {
        try {
            const response = await axiosInstance.get(`/food/list/${restaurantId}`)
            setCategories(response.data.categories)
            setFoods(response.data.foods)
        } catch (error) {
            console.log(error)
        }
    }

    const getOrderData = async () => {
        try {
            const response = await axiosInstance.get(`/user/order/list/${userData._id}`)
            const runingOrder = response?.data?.data.find(ord => ord.paymentStatus === 'Paid' && ord.orderStatus !== 'Completed')
            setOrderData(runingOrder)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getRestaurantFoodList();
        getOrderData()
    }, [])




    return (
        <div>
            {categories.map(category => (
                <div>
                    <p className='text-2xl font-extrabold text-gray-800 py-10'>{category}</p>
                    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4'>
                        {foods.map(food => food.category.name === category && (
                            <div className='w-full h-[160px] flex justify-between border border-gray-200 rounded-[15px]  hover:bg-orange-100 cursor-pointer transition duration-150'>
                                <div className='flex flex-col  gap-1.5 p-2 text-gray-700'>
                                    <p className='text-[24px] font-medium text-gray-900'>{food.foodName}</p>
                                    <p className='text-[18px]'>TK <span className='font-bold'>{food.price}</span></p>
                                    <p className='text-[17px] font-sans line-clamp-2 text-sm'>{food.description}</p>
                                </div>
                                <div className='flex h-full relative'>
                                    <img className='p-2 size-40 h-full shrink-0 rounded-[20px]' src={`http://localhost:5000/images/${food.image}`} alt="" />
                                    <button
                                        onClick={() => { dispatch(setUser(userId)), dispatch(addToCart({ restaurantId, food, restaurantData })) }}
                                        className='absolute bottom-3 right-[8%] flex items-center justify-center size-10 rounded-full bg-white hover:bg-gray-100 cursor-pointer'>
                                        <GrAdd className='text-2xl text-gray-700' />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RestaurantFoodList