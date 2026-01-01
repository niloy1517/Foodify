import React, { useEffect, useRef, useState } from 'react'
import { FaRegImages } from "react-icons/fa6";
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { toast } from 'react-toastify';

const FoodAdd = () => {
    const imageRef = useRef();

    axios.defaults.withCredentials = true;

    const [featured, setFeatured] = useState(false);
    const [availability, setAvailability] = useState(false);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [foodData, setFoodData] = useState({
        foodName: '',
        description: '',
        image: '',
        imagePath: '',
        category: '',
        price: '',
        discount: '',
    });
    
    const [categories, setCategories] = useState([]);
    
    const dispatch = useDispatch()

    const restaurantId = useSelector((state) => state.restaurant.restaurantId)
    

    const imageOnchange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFoodData({
                ...foodData,
                image: URL.createObjectURL(file),
                imagePath: file
            })
        }
    }

    const uploadImage = () => {
        imageRef.current.click()
    }

    const handleOnchange = (e) => {
        setFoodData({ ...foodData, [e.target.name]: e.target.value })
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


    const handleCategoryList = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/category/list`)
            setCategories(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        handleCategoryList();
    }, [])

    const addFoodItem = async () => {
        const payload = {
            ...foodData,
            featured,
            availability,
            restaurant: restaurantId,
            cuisines: JSON.stringify(selectedCuisines)
        }
        try {
            const formData = new FormData();

            formData.append('foodData', JSON.stringify(payload));
            if (foodData.imagePath) {
                formData.append('image', foodData.imagePath)
            }

            const response = await axios.post(`http://localhost:5000/api/food/add`, formData, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.log(error)
        }
    }

    return (
        <div className='w-full h-[90vh] overflow-y-auto px-6'>
            <div className='flex items-center justify-between px-6 py-6 border-b border-gray-200'>
                <p className='text-3xl text-gray-800 font-medium'>Add New Food Item</p>
                <button className='bg-orange-600 text-white text-[18px] font-medium px-4 py-2 rounded cursor-pointer hover:bg-orange-700'>Back to deshboard</button>
            </div>
            <div className='mt-10 flex flex-wrap justify-between gap-10'>
                <div className='flex-1'>
                    <h1 className='text-2xl font-medium text-gray-800'>Basic Information</h1>
                    <div className='mt-4 flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="foodName" className='text-[18px] font-medium text-gray-800'>Food Name</label>
                            <input type="text" name="foodName" id="foodName" placeholder='Enter food name' onChange={handleOnchange} className='w-full h-12 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="description" className='text-[18px] font-medium text-gray-800'>Description</label>
                                <textarea name="description" id="description" placeholder='Describe your food items...' onChange={handleOnchange} className='w-full min-h-30 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600'></textarea>
                            </div>
                            <p>A good description helps customers understand what they're ordering.</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='text-[18px] font-medium text-gray-800'>Image</p>
                            <div onClick={uploadImage} className='w-full h-50 overflow-hidden flex items-center justify-center border border-dashed border-gray-300 cursor-pointer rounded hover:border-orange-600'>
                                {
                                    foodData.imagePath ?
                                        <img className='w-full h-full' src={foodData.image} alt="" />
                                        :
                                        <div>
                                            <input ref={imageRef} type="file" name="" id="" onChange={imageOnchange} className='hidden' />
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
                        <h1 className='text-2xl font-medium text-gray-800'>Category & Restaurant</h1>
                        <div className='mt-4 flex flex-col gap-4'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="category" className='text-[18px] font-medium text-gray-800'>Category</label>
                                <select name="category" id="category" onChange={handleOnchange} className='w-full h-12 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600'>
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
                                <input type="text" name="price" id="price" onChange={handleOnchange} placeholder='Enter food price' className='w-full h-12 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600' />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="discount" className='text-[18px] font-medium text-gray-800'>Discount Price</label>
                                    <input type="text" name="discount" id="discount" onChange={handleOnchange} placeholder='Enter discount price 0.00' className='w-full h-12 border border-gray-200 outline-0 px-4 py-1 rounded hover:border-orange-600' />
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
                            <input onClick={() => setFeatured(!featured)} onChange={handleOnchange} type="checkbox" class="sr-only peer" name='featured' />
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
                            <input onClick={() => setAvailability(!availability)} onChange={handleOnchange} type="checkbox" class="sr-only peer" name='availability' />
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
                <button onClick={addFoodItem} className='bg-orange-600 text-white px-6 py-2 rounded cursor-pointer font-medium text-[18px] my-10'>Save Food</button>
            </div>
        </div>
    )
}

export default FoodAdd