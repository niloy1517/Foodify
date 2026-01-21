import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { categoryData, categoryId } from '../Services/Redux/Slices/categorySlice';
import { toast } from 'react-toastify';
import { axiosInstance } from '../Api/axiosInstance';

const CategoryList = () => {
    const tableHeader = [
        'Image', 'Category Name', 'Status', 'Priority', 'Action'
    ]

    const [categories, setCategories] = useState([])
    

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await axiosInstance.delete(`/category/delete`, 
                {
                    data: {categoryId}
                })
            if(response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }


    const handleCategoryList = async () => {
        try {
            const response = await axiosInstance.get(`/category/list`)
            setCategories(response.data.data)
        } catch (error) {
            console.log(error)
        }
    } 


    useEffect(() => {
        handleCategoryList();
    }, [handleDeleteCategory])

  return (
    <div className='w-full h-auto my-10'>
        <table className="w-full text-left border-collapse">
            <thead className="uppercase bg-gray-100">
                <tr>
                {tableHeader.map((item, index) => (
                    <th key={index} className="px-4 py-2">{item}</th>
                ))}
                </tr>
            </thead>

            <tbody>
                {
                    categories.length != 0 ?
                    (
                        categories.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 text-[18px] font-medium text-gray-700">
                    <td className="px-4 py-2">
                    <img
                        className="w-24 h-16 object-cover rounded"
                        src={`${import.meta.env.VITE_IMAGE_BASE_URL}/images/${item.image}`}
                        alt={item.name}
                    />
                    </td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="px-4 py-2">{item.priority}</td>
                    <td className="px-4 py-2 flex items-center gap-4 mt-4">
                    <button onClick={() => {
                        dispatch(categoryId(item._id));
                        setTimeout(() => {
                            navigate('/categories/update')
                        }, 1000)
                    }} className="bg-blue-500 hover:bg-blue-700 text-white p-1 rounded flex items-center justify-center text-2xl cursor-pointer">
                        <FaRegEdit />
                    </button>
                    <button onClick={() => handleDeleteCategory(item._id)} className="bg-red-500 hover:bg-red-700 text-white p-1 rounded flex items-center justify-center text-2xl cursor-pointer">
                        <MdOutlineDelete />
                    </button>
                    </td>
                </tr>
                ))
                    ) : (
                        <tr>
              <td colSpan={7} className="text-center py-15 text-2xl text-gray-700 font-medium">
                No Categories Found!
              </td>
            </tr>
                    )
                }
            </tbody>
        </table>
    </div>
  )
}

export default CategoryList