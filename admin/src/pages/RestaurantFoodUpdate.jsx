import axios from 'axios';
import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { FaRegImages } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';


const RestaurantFoodUpdate = () => {
  const [updateFoodData, setUpdateFoodData] = useState({})
  const [categories, setCategories] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([])

  axios.defaults.withCredentials = true;

  const imageRef = useRef()



  const foodId = useSelector((state) => state.food.foodId)

  const imageOnchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUpdateFoodData({
        ...updateFoodData,
        image: URL.createObjectURL(file),
        imagePath: file
      })
    }
  }

  const uploadImage = () => {
    imageRef.current.click()
  }

  const handleOnchange = (e) => {
    setUpdateFoodData({ ...updateFoodData, [e.target.name]: e.target.value })
  }

  const cuisineOptions = [
    "Bangladeshi",
    "Indian",
    "Chinese",
    "Thai",
    "Italian",
    "Fast Food",
    "Mexican",
    "Japanese",
    "Korean",
    "American",
    "Middle Eastern",
    "Mughlai",
    "Continental",
    "BBQ",
    "Seafood",
    "Vegan",
    "Dessert",
    "Bakery",
    "Beverages",
    "Healthy Food"
  ];

  const updateFoodItems = async () => {
    const payload = {
      ...updateFoodData,
      image: updateFoodData.imagePath ? updateFoodData.image : updateFoodData.image,
      cuisines: JSON.stringify(selectedCuisines)
    }
    try {
      const formData = new FormData()
      formData.append('foodData', JSON.stringify(payload))
      if (updateFoodData.imagePath) {
        formData.append('image', updateFoodData.imagePath)
      }
      
      const response = await axios.put(`http://localhost:5000/api/food/update`, formData, { withCredentials: true })
      
      if (response.data.success) {
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
      const response = await axios.get(`http://localhost:5000/api/category/list`)
      setCategories(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }



  const getFoodItem = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/food/item/${foodId}`)
      setUpdateFoodData(response.data.data)
      setSelectedCuisines(JSON.parse(response.data.data.cuisines))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleCategoryList();
    getFoodItem()
  }, [])

  return (
    <div className='w-full h-[90vh] overflow-y-auto px-6'>
      <div className='flex items-center justify-between px-6 py-6 border-b border-gray-200'>
        <p className='text-3xl text-gray-800 font-medium'>Update Food Item</p>
        <button className='bg-orange-600 text-white text-[18px] font-medium px-4 py-2 rounded cursor-pointer hover:bg-orange-700'>Back to deshboard</button>
      </div>
      <div className='mt-10 flex flex-wrap justify-between gap-10'>
        <div className='flex-1'>
          <h1 className='text-2xl font-medium text-gray-800'>Basic Information</h1>
          <div className='mt-4 flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="foodName" className='text-[18px] font-medium text-gray-800'>Food Name</label>
              <input type="text" name="foodName" id="foodName" placeholder='Enter food name' value={updateFoodData.foodName} onChange={handleOnchange} className='w-full h-12 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600' />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="description" className='text-[18px] font-medium text-gray-800'>Description</label>
                <textarea name="description" id="description" placeholder='Describe your food items...' value={updateFoodData.description} onChange={handleOnchange} className='w-full min-h-30 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600'></textarea>
              </div>
              <p>A good description helps customers understand what they're ordering.</p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-[18px] font-medium text-gray-800'>Image</p>
              <div onClick={uploadImage} className='w-full h-50 overflow-hidden flex items-center justify-center border border-dashed border-gray-300 cursor-pointer rounded hover:border-orange-600'>
                <input ref={imageRef} type="file" name="image" id="image" onChange={imageOnchange} className='hidden' />
                {
                  updateFoodData.image ?
                    <img className='w-full h-full' src={updateFoodData.imagePath ? updateFoodData.image : `http://localhost:5000/images/${updateFoodData.image}`} alt="" />
                    :
                    <div>
                      <FaRegImages className='text-7xl text-gray-300' />
                      <p className='text-2xl font-medium text-orange-600'>Browse Files</p>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1'>
          <div>
            <h1 className='text-2xl font-medium text-gray-800'>Category & Cuisine</h1>
            <div className='mt-4 flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="category" className='text-[18px] font-medium text-gray-800'>Category</label>
                <select name="category" id="category" onChange={handleOnchange} value={updateFoodData.category} className='w-full h-12 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600'>
                  <option value="" className='hidden'>Select...</option>
                  {
                    categories.map(category => (
                      <option key={category.index} value={category._id}>{category.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <label htmlFor="" className='text-[18px] font-medium text-gray-800'>Cuisine</label>
            <div className='flex flex-wrap gap-3'>
              <Select
                isMulti
                options={cuisineOptions.map(c => ({ value: c, label: c }))}
                value={selectedCuisines.map(c => ({ value: c, label: c }))}
                onChange={(selected) => setSelectedCuisines(selected.map(item => item.value))}
                className='w-full h-14 outline-orange-600'
              />
            </div>
          </div>
          <div>
            <h1 className='text-2xl font-medium text-gray-800 mt-4'>Pricing & Offers</h1>
            <div className='mt-4 flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="price" className='text-[18px] font-medium text-gray-800'>Price</label>
                <input type="text" name="price" id="price" onChange={handleOnchange} value={updateFoodData.price} placeholder='Enter food price' className='w-full h-12 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600' />
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-2'>
                  <label htmlFor="discount" className='text-[18px] font-medium text-gray-800'>Discount Price</label>
                  <input type="text" name="discount" id="discount" onChange={handleOnchange} value={updateFoodData.discount} placeholder='Enter discount price 0.00' className='w-full h-12 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600' />
                </div>
                <p>Leave empty if no discount</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className='w-[50%]'>
        <h1 className='text-2xl font-medium text-gray-800 mt-4'>Featured & Availability</h1>
        <div>
          <div className='rounded-[8px]'>
            <label class="w-full h-14 flex justify-between items-center cursor-pointer text-[18px] font-medium text-gray-700">
              Featured Category
              <input onClick={() => setUpdateFoodData({ ...updateFoodData, featured: !updateFoodData.featured })} type="checkbox" class="sr-only peer" name='featured' checked={updateFoodData.featured} />
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
          <div className='rounded-[8px]'>
            <label class="w-full h-14 flex justify-between items-center cursor-pointer text-[18px] font-medium text-gray-700">
              Availability
              <input onClick={() => setUpdateFoodData({ ...updateFoodData, availability: !updateFoodData.availability })} type="checkbox" checked={updateFoodData.availability} class="sr-only peer" name='availability' />
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
        </div>
      </div>
      <div>
        <button onClick={updateFoodItems} className='bg-orange-600 text-white px-6 py-2 rounded cursor-pointer font-medium text-[18px] my-10'>Save Food</button>
      </div>
    </div>
  )
}

export default RestaurantFoodUpdate