import React, { useRef, useState } from 'react'
import { FaRegImages } from "react-icons/fa6";
import { IoAddCircleSharp } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify'
import { axiosInstance } from '../Api/axiosInstance';

const CategoriesAdd = () => {
    const imageRef = useRef()
    const [image, setImage] = useState('')
    const [featured, setFeatured] = useState(false)
    const [categoryData, setCategoryData] = useState({
        name: '',
        description: '',
        priority: '',
        status: ''
    })



    const imageOnchange = (e) => {
        const imageFile = e.target.files[0];
        if (imageFile) {
            setImage({
                image: URL.createObjectURL(imageFile),
                imagePath: imageFile
            })
        }
    }

    const uploadImage = () => {
        imageRef.current.click();
    }

    const handleOnchange = (e) => {
        setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
    }


    const handleSaveCategory = async () => {
        try {
            const payload = {
                ...categoryData,
                featured
            }

            const formData = new FormData();

            formData.append('categoriesData', JSON.stringify(payload));

            if (image.imagePath) {
                formData.append('image', image.imagePath)
            }

            const response = await axiosInstance.post('/category/add', formData)
            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='my-10'>
            <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
                <div className='flex items-center gap-1.5'>
                    <div className='size-12 flex items-center justify-center rounded-full bg-orange-200'>
                        <IoAddCircleSharp className='text-4xl text-orange-600' />
                    </div>
                    <p className='text-2xl font-medium text-gray-700'>Add New Categories</p>
                </div>
                <button className='px-6 py-1.5 text-white bg-orange-600 text-[18px] font-medium cursor-pointer rounded'>Back</button>
            </div>
            <div className='w-[60%] mt-10 flex flex-col gap-4'>
                <div className='flex flex-col gap-1.5 px-10'>
                    <label htmlFor="name" className='text-[18px] font-medium text-gray-700'>Category Name</label>
                    <input type="text" name="name" id="name" placeholder='Enter category name' onChange={handleOnchange} className='w-full h-14 px-3 text-[17px] border border-gray-300 outline-0 focus:border-2 focus:border-orange-500 focus:outline-3 outline-gray-300 rounded-[8px]' />
                </div>
                <div className='flex flex-col gap-1.5 px-10'>
                    <label htmlFor="description" className='text-[18px] font-medium text-gray-700'>Description</label>
                    <input type="text" name="description" id="description" placeholder='Enter description' onChange={handleOnchange} className='w-full h-14 px-3 text-[17px] border border-gray-300 outline-0 focus:border-2 focus:border-orange-500 focus:outline-3 outline-gray-300 rounded-[8px]' />
                </div>
                <div className='flex flex-col gap-1.5 px-10'>
                    <label htmlFor="image" className='text-[18px] font-medium text-gray-700'>Category Image</label>

                    <div onClick={uploadImage} className='w-full h-50 overflow-hidden border border-gray-300 border-dashed rounded-[8px] hover:border-orange-600 flex flex-col gap-2 items-center justify-center bg-gray-100 hover:bg-orange-100 cursor-pointer'>
                        <input ref={imageRef} type="file" name="image" id="image" onChange={imageOnchange} className='hidden' />
                        {
                            image.imagePath ? (
                                <img className='w-full h-full' src={image.image} alt="" />
                            ) :
                                (
                                    <div className='flex flex-col justify-center items-center'>
                                        <FaRegImages className='text-5xl text-gray-300' />
                                        <p className='text-2xl font-medium text-orange-600'>Browse Files</p>
                                    </div>
                                )
                        }
                    </div>
                </div>
                <div className='mx-6 rounded-[8px]'>
                    <label class="w-full h-14 flex justify-between items-center cursor-pointer px-3 text-[18px] font-medium text-gray-700">
                        Featured Category
                        <input onClick={() => setFeatured(!featured)} type="checkbox" class="sr-only peer" name='featured' />
                        <div
                            class="relative w-11 h-6 bg-gray-200 rounded-full
                        peer-focus:ring-4 peer-focus:ring-orange-600
                        dark:peer-focus:ring-orange-300 dark:bg-gray-600
                        peer-checked:after:translate-x-full
                        rtl:peer-checked:after:-translate-x-full
                        peer-checked:after:border-orange-600 after:content-['']
                        after:absolute after:top-0.5 after:left-[2px]
                        after:bg-white after:border-gray-300 after:border
                        after:rounded-full after:h-5 after:w-5 after:transition-all
                        dark:border-gray-600 peer-checked:bg-orange-600
                        dark:peer-checked:bg-orange-600">
                        </div>
                    </label>
                </div>
                <div className='h-auto flex flex-col gap-8 rounded-[8px]'>
                    <div className='px-9 flex items-center justify-between pt-4'>
                        <label htmlFor="priority" className='text-[18px] font-medium text-gray-700'>Display Priority</label>
                        <input type="number" name="priority" id="priority" onChange={handleOnchange} className='w-50 h-12 border border-gray-300 outline-0 focus:border-2 focus:border-orange-500 focus:outline-3 outline-gray-300 rounded-[8px] px-4' />
                    </div>
                    <div className='flex items-center justify-between px-9'>
                        <label htmlFor="status" className='text-[18px] font-medium text-gray-700'>Status</label>
                        <select name="status" id="status" onChange={handleOnchange} className='w-50 h-12 border border-gray-300 outline-0 focus:border-2 focus:border-orange-500 focus:outline-3 outline-gray-300 rounded-[8px] px-4'>
                            <option value="" className='hidden'>Select one</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
                <div className='flex justify-end gap-12 mr-8 mt-10'>
                    <button className='px-8 py-2 rounded cursor-pointer bg-gray-300 font-medium'>Cancle</button>
                    <button onClick={handleSaveCategory} className='px-8 py-2 rounded cursor-pointer bg-orange-600 text-white font-medium'>Save Category</button>
                </div>
            </div>
        </div>
    )
}

export default CategoriesAdd