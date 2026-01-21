import React, { useEffect, useRef, useState } from 'react'
import { FaRegImages } from "react-icons/fa6";
import { GrDocumentUpdate } from "react-icons/gr";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { axiosInstance } from '../Api/axiosInstance';

const CategoriesUpdate = () => {
  const [updatedImage, setUpdatedImage] = useState('')
 
  const categoryId = useSelector((state) => state.categories.categoryId)

  const imageRef = useRef()


  const [category, setCategory] = useState({
    name: '' ,
    description: '',
    priority: '',
    featured: '',
    status: '',
    image: ''
  })


  const handleOnchange = (e) => {
    setCategory({...category, [e.target.name]: e.target.value})
  }

  const imageOnchange = (e) => {
    const file = e.target.files[0]
    if(file) {
      setUpdatedImage({
        image: URL.createObjectURL(file),
        imagePath: file
      })
    }
  }

  const uploadImage = () => {
    imageRef.current.click()
  }

    const handleEditCategory = async () => {
        try {
            const response = await axiosInstance.post(`/category/data`, {categoryId});
            setCategory(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }
 
    useEffect(() => {
      handleEditCategory()
    }, [])

  const updateCategory = async () => {
    try {
      const payload = {
        ...category,
        image: updatedImage.image ? updatedImage.image : category.image
      }
      const formData = new FormData()
      formData.append('categoryId', categoryId)
      formData.append('category', JSON.stringify(payload))

      if(updatedImage.imagePath) {
        formData.append('image', updatedImage.imagePath)
      }

      const response = await axiosInstance.post(`/category/update`, formData)
      if(response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }



  return (
    <div className='my-10'>
        <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
            <div className='flex items-center gap-1.5'>
                <div className='size-12 flex items-center justify-center rounded-full bg-orange-200'>
                    <GrDocumentUpdate className='text-3xl text-orange-600' />
                </div>
                <p className='text-2xl font-medium text-gray-700'>Update Categories</p>
            </div>
            <button className='px-6 py-1.5 text-white bg-orange-600 text-[18px] font-medium cursor-pointer rounded'>Back</button>
        </div>
        <div className='w-[60%] mt-10 flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5 px-10'>
                <label htmlFor="name" className='text-[18px] font-medium text-gray-700'>Category Name</label>
                <input type="text" name="name" id="name" placeholder='Enter category name' value={category.name} onChange={handleOnchange} className='w-full h-14 px-3 text-[17px] border border-gray-300 outline-0 focus:border-2 focus:border-orange-500 focus:outline-3 outline-gray-300 rounded-[8px]' />
            </div>
            <div className='flex flex-col gap-1.5 px-10'>
                <label htmlFor="description" className='text-[18px] font-medium text-gray-700'>Description</label>
                <input type="text" name="description" id="description" placeholder='Enter description' value={category.description} onChange={handleOnchange} className='w-full h-14 px-3 text-[17px] border border-gray-300 outline-0 focus:border-2 focus:border-orange-500 focus:outline-3 outline-gray-300 rounded-[8px]' />
            </div>
            <div className='flex flex-col gap-1.5 px-10'>
                <label htmlFor="image" className='text-[18px] font-medium text-gray-700'>Category Image</label>
                
                <div  onClick={uploadImage} className='w-full h-50 overflow-hidden border border-gray-300 border-dashed rounded-[8px] hover:border-orange-600 flex flex-col gap-2 items-center justify-center bg-gray-100 hover:bg-orange-100 cursor-pointer'>
                    <input ref={imageRef} type="file" name="image" id="image" onChange={imageOnchange} className='hidden' />
                    {
                        category.image ? (
                            <img className='w-full h-full' src={updatedImage.image || `${import.meta.env.VITE_IMAGE_BASE_URL}/images/${category.image}`} alt="" />
                        ) :
                        (
                            <div className='flex flex-col items-center justify-center'>
                                <FaRegImages className='text-5xl text-gray-300' />
                                <p className='text-2xl font-medium text-orange-600'>Browse Files</p>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='mx-6 rounded-[8px]'>
                <label className="w-full h-14 flex justify-between items-center cursor-pointer px-3 text-[18px] font-medium text-gray-700">
                    Featured Category
                    <input onClick={() => setCategory({...category, featured: !category.featured})} type="checkbox" checked={category.featured} className="sr-only peer" name='featured' />
                    <div
                        className="relative w-11 h-6 bg-gray-200 rounded-full
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
                    <input type="number" name="priority" id="priority" onChange={handleOnchange} value={category.priority} className='w-50 h-12 border border-gray-300 outline-0 focus:border-2 focus:border-orange-500 focus:outline-3 outline-gray-300 rounded-[8px] px-4' />
                </div>
                <div className='flex items-center justify-between px-9'>
                    <label htmlFor="status" className='text-[18px] font-medium text-gray-700'>Status</label>
                    <select name="status" id="status" onChange={handleOnchange} value={category.status} className='w-50 h-12 border border-gray-300 outline-0 focus:border-2 focus:border-orange-500 focus:outline-3 outline-gray-300 rounded-[8px] px-4'>
                        <option value="" className='hidden'>Select one</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div className='flex justify-end gap-12 mr-8 mt-10'>
                <button className='px-8 py-2 rounded cursor-pointer bg-gray-300 font-medium'>Cancle</button>
                <button onClick={updateCategory} className='px-8 py-2 rounded cursor-pointer bg-orange-600 text-white font-medium'>Update Category</button>
            </div>
        </div>
    </div>
  )
}

export default CategoriesUpdate