import React, { useContext, useEffect, useState } from 'react'
import { storeContext } from '../Context/Context'
import SwiperSlider from '../components/SwiperSlider'
import { restaurantService } from '../Services/restaurant.service'

const PopularRestaurantsPage = () => {
    const {restaurants} = useContext(storeContext);
    const [restaurantList, setRestaurantList] = useState([]);

    const getAllRestaurants = async () => {
        try {
            const response = await restaurantService.getAll();
            setRestaurantList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }
console.log(restaurantList)
    useEffect(() => {
        getAllRestaurants();
    }, [])
    return (
        <div className='w-full px-4 md:px-10'>
            <h1 className='text-3xl font-semibold text-gray-800 py-14'>Popular restaurants</h1>
            <SwiperSlider restaurants={restaurantList?.slice(0, 20)} />
        </div>
    )
}

export default PopularRestaurantsPage