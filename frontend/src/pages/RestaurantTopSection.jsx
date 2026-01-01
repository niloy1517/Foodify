import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineDeliveryDining } from "react-icons/md"
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaStar } from "react-icons/fa"
import { IoIosSearch } from "react-icons/io";
import { IoMdTime } from "react-icons/io"
import { setRestaurantData } from '../Service/Redux/Slice/RestaurantSlice';




const RestaurantTopSection = () => {
    const restaurantId = useSelector((state) => state.restaurant.restaurantId)

    const dispatch = useDispatch()

    const [restaurant, setRestaurant] = useState('')
    const [categories, setCategories] = useState([])
    const [foods, setFoods] = useState([])
    const [activeCategory, setActiveCategory] = useState(categories[0])



    const foodsInCategory = categories.map(category => {
        const categoryLength = foods.filter(food => food.category.name === category).length
        return categoryLength
    })




    const handleFoodCategoryScroll = (category) => {
        const elem = document.getElementById(category)
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' })
        }
    }


    const getRestaurantData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/restaurant/details/${restaurantId}`)
            setRestaurant(response.data.data)
            dispatch(setRestaurantData(response.data.data))
        } catch (error) {
            console.log(error)
        }
    }

    const getRestaurantFoodList = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/food/list/${restaurantId}`)
            setCategories(response.data.categories)
            setFoods(response.data.foods)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getRestaurantData();
        getRestaurantFoodList()
    }, [])

    return (
        <div>
            <div className='flex space-x-2 py-4 mx-10'>
                <ul className='flex items-center space-x-2'>
                    <li><a href="/" className='border-b pb-0.5'>Homepage</a></li>
                    <MdNavigateNext className='text-gray-400' />
                    <li><a href="" className='border-b pb-0.5'>{restaurant.city}</a></li>
                    <MdNavigateNext className='text-gray-400' />
                    <li><a href="" className='border-b pb-0.5'>{restaurant.restaurantName}</a></li>
                </ul>
                <p>{restaurant.name}</p>
            </div>
            <div className='px-10 pt-4 flex items-center space-x-6 border-b border-gray-200 pb-5'>
                <img className='w-40 h-40 rounded-2xl' src={`http://localhost:5000/images/${restaurant.image}`} alt="" />
                <div className='flex flex-col space-y-2'>
                    <p className='font-bold text-3xl pb-3'>{restaurant.restaurantName}</p>
                    <div className='flex space-x-6'>
                        <div className='flex items-center space-x-1.5'>
                            <MdOutlineDeliveryDining className='text-[20px]' />
                            <p>{restaurant.deliveryFee} delivery</p>
                        </div>
                        <div className='flex items-center space-x-1.5'>
                            <IoMdTime />
                            <p>{restaurant.deliveryTime}</p>
                        </div>
                    </div>
                    <div className='flex space-x-1 font-medium'>
                        <div className='flex items-center space-x-1.5'>
                            <FaStar className='text-amber-400' />
                            <p>3500+</p>
                        </div>
                        <button className='flex items-center gap-1 px-1 py-1 rounded-[7px] cursor-pointer hover:bg-gray-200'>
                            See reviews
                        </button>
                        <button className='flex items-center gap-1 px-1 py-1 rounded-[7px] cursor-pointer hover:bg-gray-200'>
                            <IoIosInformationCircleOutline className='text-[20px]' />
                            <span>More info</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantTopSection


