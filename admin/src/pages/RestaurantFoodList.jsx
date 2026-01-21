import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegEdit } from 'react-icons/fa'
import { MdOutlineDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { setFoodId } from '../Services/Redux/Slices/foodSlice'
import { toast } from 'react-toastify'
import { axiosInstance } from '../Api/axiosInstance'
const RestaurantFoodList = () => {
    const [foodList, setFoodList] = useState([])

    const restaurantId = useSelector((state) => state.restaurant.restaurantId)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getRestaurantFoodList = async () => {
        try {
            const response = await axiosInstance.get(`/food/list/${restaurantId}`)
            setFoodList(response.data.foods)
        } catch (error) {
            console.log(error)
        }
    }


    const deleteRestaurantFoodItem = async (foodId) => {
        try {
            const response = await axiosInstance.delete(`/food/delete/${foodId}`)

            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getRestaurantFoodList();
    }, [deleteRestaurantFoodItem])

    const tableHeader = ['Image', 'Food Name', 'Category', 'Price', 'Rating', 'Availability', 'Action']
    return (
        <div>
            <table className="w-full table-fixed border-collapse text-left">
                <thead className="bg-gray-100 uppercase">
                    <tr>
                        {tableHeader.map((item, index) => (
                            <th key={index} className="px-4 py-2 border-b border-gray-300">{item}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {foodList.length > 0 ? (
                        foodList.map((food) => (
                            <tr key={food._id} className="border-b border-gray-200 text-[16px] font-medium text-gray-700">
                                <td className="px-4 py-2">
                                    <img
                                        className="w-24 h-16 object-cover rounded"
                                        src={`${import.meta.env.VITE_IMAGE_BASE_URL}/images/${food.image}`}
                                        alt={food.foodName}
                                    />
                                </td>
                                <td className="px-4 py-2">{food.foodName}</td>
                                <td className="px-4 py-2">
                                    {food.category.name}
                                </td>
                                <td className="px-4 py-2">{food.price}</td>
                                <td className="px-4 py-2">{food.rating}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2.5 py-1 rounded-[15px] ${food.availability === true ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'}`}>
                                        {food.availability === true ? 'Able' : 'Unable'}
                                    </span>
                                </td>
                                <td className="px-4 py-2 flex gap-3 mt-4.5">
                                    <button
                                        onClick={() => {
                                            dispatch(setFoodId(food._id))
                                            navigate('/restaurant/food/update')
                                        }}
                                        className="px-1 py-1 flex justify-center items-center rounded bg-blue-600 text-white text-[24px] cursor-pointer"
                                    >
                                        <FaRegEdit className="inline" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            deleteRestaurantFoodItem(food._id)
                                        }}
                                        className="px-1 py-1 flex justify-center items-center rounded bg-red-600 text-white text-[24px] cursor-pointer"
                                    >
                                        <MdOutlineDelete className="inline" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center py-15 text-2xl text-gray-700 font-medium">
                                No Food Found!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default RestaurantFoodList