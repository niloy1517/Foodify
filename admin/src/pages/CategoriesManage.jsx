import React from 'react'
import { FaLayerGroup } from "react-icons/fa";
import { FaPauseCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios'

const CategoriesManage = () => {
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    const activeCategoriesLength = categories.filter(cate => cate.status === 'active')
    const inactiveCategoriesLength = categories.filter(cate => cate.status !== 'active')

    const categoryList = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/category/list`)
            setCategories(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        categoryList()
    }, [])
    return (
        <div className='pt-10'>
            <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
                <div className='flex items-center gap-1.5 text-3xl font-medium text-gray-700'>
                    <div className='w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center'>
                        <FaLayerGroup className='text-orange-600' />
                    </div>
                    <p>Food Categories</p>
                </div>
                <button onClick={() => { navigate('/categories/add') }} className='flex items-center gap-1.5 text-[18px] px-4 py-2 bg-orange-600 text-white font-medium rounded-[8px] cursor-pointer'><IoMdAdd className='text-3xl font-bold' /> Add Category</button>
            </div>
            <div className='mt-14 w-full'>
                <div className='w-full flex justify-center flex-wrap gap-4'>
                    <div className='flex-1 h-40 shadow rounded flex px-4 items-center hover:mt-[-10px] transition-normal duration-300 ease-in'>
                        <div className='size-12 rounded bg-pink-600 flex items-center justify-center'>
                            <FaLayerGroup className='text-white text-3xl' />
                        </div>
                        <div className='px-4 flex flex-col gap-1'>
                            <p className='text-4xl font-medium'>{categories?.length}</p>
                            <p className='text-[17px] font-medium text-gray-600'>Total Categories</p>
                        </div>
                    </div>
                    <div className='flex-1 h-40 shadow rounded flex px-4 items-center hover:mt-[-10px] transition-normal duration-300 ease-in'>
                        <div className='size-12 rounded bg-green-600 flex items-center justify-center'>
                            <FaCheckCircle className='text-white text-3xl' />
                        </div>
                        <div className='px-4 flex flex-col gap-1'>
                            <p className='text-4xl font-medium'>{activeCategoriesLength.length}</p>
                            <p className='text-[17px] font-medium text-gray-600'>Active Categories</p>
                        </div>
                    </div>
                    <div className='flex-1 h-40 shadow rounded flex px-4 items-center hover:mt-[-10px] transition-normal duration-300 ease-in'>
                        <div className='size-12 rounded bg-yellow-400 flex items-center justify-center'>
                            <FaPauseCircle className='text-white text-3xl' />
                        </div>
                        <div className='px-4 flex flex-col gap-1'>
                            <p className='text-4xl font-medium'>{inactiveCategoriesLength.length}</p>
                            <p className='text-[17px] font-medium text-gray-600'>Inactive Categories</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoriesManage


