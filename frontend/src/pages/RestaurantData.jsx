import React from 'react'

const RestaurantData = () => {
    return (
        <div>
            <div className='flex space-x-2 py-4 mx-10'>
                <ul className='flex items-center space-x-2'>
                    <li><a href="/" className='border-b pb-0.5'>Homepage</a></li>
                    <MdNavigateNext className='text-gray-400' />
                    <li><a href="" className='border-b pb-0.5'>{restaurant.city}</a></li>
                    <MdNavigateNext className='text-gray-400' />
                </ul>
                <p>{restaurant.name}</p>
            </div>
            <div className='px-10 pt-4 flex items-center space-x-6 border-b border-gray-400 pb-5'>
                <img className='w-40 h-40 rounded-2xl' src={`http://localhost:5000/images/${restaurant.image}`} alt="" />
                <div className='flex flex-col space-y-2'>
                    <p className='font-bold text-3xl pb-3'>{restaurant.name}</p>
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
            <div className='stiky z-10 bg-[#FBFBFB]'>
                <div className='flex items-center space-x-25 px-10 py-2.5 shadow-2xl'>
                    <div className='flex items-center'>
                        <input className='relative w-55 h-9 bg-gray-100 rounded-2xl px-3 outline-gray-400 hover:border hover:border-gray-300 transition-transform ease-in-out' type="text" placeholder='Search in menu' />
                        <IoIosSearch className='text-[22px] text-gray-600 cursor-pointer absolute ml-47 hover:text-gray-800' />
                    </div>
                    <div className='flex space-x-15'>
                        {
                            foods.map((data, index) => (
                                <div key={index} className='font-medium'>
                                    <button onClick={() => { setActiveCategory(data.category), handleFoodCategoryScroll(data.category) }} className={`cursor-pointer opacity-60 hover:opacity-80 ${activeCategory === data.category ? 'border-b-2 opacity-100' : ''}`}>{`${data.category} (${data.foods.length})`}</button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantData